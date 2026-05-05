package content

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresStore struct {
	db *pgxpool.Pool
}

func NewPostgresStore(db *pgxpool.Pool) *PostgresStore {
	return &PostgresStore{db: db}
}

func (s *PostgresStore) List(ctx context.Context, filter ListFilter) ([]Item, error) {
	where := []string{"1=1"}
	args := []any{}

	if filter.Category != "" {
		args = append(args, filter.Category)
		where = append(where, fmt.Sprintf("ci.category = $%d", len(args)))
	}
	if filter.Status != "" {
		args = append(args, filter.Status)
		where = append(where, fmt.Sprintf("ci.status = $%d", len(args)))
	}
	if filter.Query != "" {
		args = append(args, "%"+filter.Query+"%")
		where = append(where, fmt.Sprintf("ci.title ilike $%d", len(args)))
	}

	rows, err := s.db.Query(ctx, `
		select
			ci.id::text,
			ci.title,
			ci.category,
			ci.status,
			ci.rating,
			ci.notes,
			coalesce(count(seasons.id), 0)::int as total_seasons,
			coalesce(sum(seasons.episode_count), 0)::int as total_episodes,
			coalesce(sum(seasons.watched_episodes), 0)::int as watched_episodes,
			ci.created_at,
			ci.updated_at
		from content_items ci
		left join seasons on seasons.content_id = ci.id
		where `+strings.Join(where, " and ")+`
		group by ci.id
		order by ci.updated_at desc, ci.created_at desc
	`, args...)
	if err != nil {
		return nil, fmt.Errorf("list content items: %w", err)
	}
	defer rows.Close()

	items := []Item{}
	for rows.Next() {
		item, err := scanItemSummary(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, rows.Err()
}

func (s *PostgresStore) Get(ctx context.Context, id string) (Item, error) {
	return s.loadItem(ctx, s.db, id)
}

func (s *PostgresStore) Create(ctx context.Context, input UpsertItemInput) (Item, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return Item{}, fmt.Errorf("begin create transaction: %w", err)
	}
	defer rollback(ctx, tx)

	var id string
	err = tx.QueryRow(ctx, `
		insert into content_items (title, category, status, rating, notes)
		values ($1, $2, $3, $4, $5)
		returning id::text
	`, input.Title, input.Category, input.Status, input.Rating, input.Notes).Scan(&id)
	if err != nil {
		return Item{}, fmt.Errorf("insert content item: %w", err)
	}

	if err := replaceSeasons(ctx, tx, id, input.Seasons); err != nil {
		return Item{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return Item{}, fmt.Errorf("commit create transaction: %w", err)
	}

	return s.Get(ctx, id)
}

func (s *PostgresStore) Update(ctx context.Context, id string, input UpsertItemInput) (Item, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return Item{}, fmt.Errorf("begin update transaction: %w", err)
	}
	defer rollback(ctx, tx)

	tag, err := tx.Exec(ctx, `
		update content_items
		set title = $1,
			category = $2,
			status = $3,
			rating = $4,
			notes = $5,
			updated_at = now()
		where id = $6
	`, input.Title, input.Category, input.Status, input.Rating, input.Notes, id)
	if err != nil {
		return Item{}, fmt.Errorf("update content item: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return Item{}, ErrNotFound
	}

	if err := replaceSeasons(ctx, tx, id, input.Seasons); err != nil {
		return Item{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return Item{}, fmt.Errorf("commit update transaction: %w", err)
	}

	return s.Get(ctx, id)
}

func (s *PostgresStore) Delete(ctx context.Context, id string) error {
	tag, err := s.db.Exec(ctx, "delete from content_items where id = $1", id)
	if err != nil {
		return fmt.Errorf("delete content item: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

func (s *PostgresStore) loadItem(ctx context.Context, querier pgxQuerier, id string) (Item, error) {
	var item Item
	err := querier.QueryRow(ctx, `
		select id::text, title, category, status, rating, notes, created_at, updated_at
		from content_items
		where id = $1
	`, id).Scan(&item.ID, &item.Title, &item.Category, &item.Status, &item.Rating, &item.Notes, &item.CreatedAt, &item.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return Item{}, ErrNotFound
	}
	if err != nil {
		return Item{}, fmt.Errorf("get content item: %w", err)
	}

	rows, err := querier.Query(ctx, `
		select id::text, season_number, episode_count, watched_episodes
		from seasons
		where content_id = $1
		order by season_number
	`, id)
	if err != nil {
		return Item{}, fmt.Errorf("list seasons: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var season Season
		if err := rows.Scan(&season.ID, &season.SeasonNumber, &season.EpisodeCount, &season.WatchedEpisodes); err != nil {
			return Item{}, fmt.Errorf("scan season: %w", err)
		}
		item.Seasons = append(item.Seasons, season)
		item.TotalSeasons++
		item.TotalEpisodes += season.EpisodeCount
		item.WatchedEpisodes += season.WatchedEpisodes
	}
	return item, rows.Err()
}

type pgxQuerier interface {
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
}

type summaryScanner interface {
	Scan(dest ...any) error
}

func scanItemSummary(row summaryScanner) (Item, error) {
	var item Item
	err := row.Scan(
		&item.ID,
		&item.Title,
		&item.Category,
		&item.Status,
		&item.Rating,
		&item.Notes,
		&item.TotalSeasons,
		&item.TotalEpisodes,
		&item.WatchedEpisodes,
		&item.CreatedAt,
		&item.UpdatedAt,
	)
	if err != nil {
		return Item{}, fmt.Errorf("scan content item: %w", err)
	}
	return item, nil
}

func replaceSeasons(ctx context.Context, tx pgx.Tx, itemID string, seasons []Season) error {
	if _, err := tx.Exec(ctx, "delete from seasons where content_id = $1", itemID); err != nil {
		return fmt.Errorf("delete seasons: %w", err)
	}
	for _, season := range seasons {
		_, err := tx.Exec(ctx, `
			insert into seasons (content_id, season_number, episode_count, watched_episodes)
			values ($1, $2, $3, $4)
		`, itemID, season.SeasonNumber, season.EpisodeCount, season.WatchedEpisodes)
		if err != nil {
			return fmt.Errorf("insert season: %w", err)
		}
	}
	return nil
}

func rollback(ctx context.Context, tx pgx.Tx) {
	_ = tx.Rollback(ctx)
}
