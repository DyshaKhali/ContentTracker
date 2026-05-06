package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Migrate(ctx context.Context, db *pgxpool.Pool) error {
	_, err := db.Exec(ctx, `
		create extension if not exists pgcrypto;

		create table if not exists content_items (
			id uuid primary key default gen_random_uuid(),
			title text not null,
			category text not null check (category in ('anime', 'movie', 'series', 'book', 'game', 'other')),
			status text not null check (status in ('planned', 'watching', 'completed')) default 'planned',
			rating integer check (rating between 1 and 10),
			notes text not null default '',
			created_at timestamptz not null default now(),
			updated_at timestamptz not null default now()
		);

		create table if not exists seasons (
			id uuid primary key default gen_random_uuid(),
			content_id uuid not null references content_items(id) on delete cascade,
			season_number integer not null check (season_number > 0),
			episode_count integer not null default 0 check (episode_count >= 0),
			watched_episodes integer not null default 0 check (watched_episodes >= 0),
			unique (content_id, season_number),
			check (watched_episodes <= episode_count or episode_count = 0)
		);

		alter table content_items drop constraint if exists content_items_category_check;
		alter table content_items add constraint content_items_category_check
			check (category in ('anime', 'movie', 'series', 'book', 'game', 'other'));

		create index if not exists idx_content_items_category on content_items(category);
		create index if not exists idx_content_items_status on content_items(status);
		create index if not exists idx_content_items_updated_at on content_items(updated_at desc);
	`)
	return err
}
