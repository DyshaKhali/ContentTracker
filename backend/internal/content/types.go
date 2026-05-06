package content

import "time"

type Category string

const (
	CategoryAnime  Category = "anime"
	CategoryMovie  Category = "movie"
	CategorySeries Category = "series"
	CategoryBook   Category = "book"
	CategoryGame   Category = "game"
	CategoryOther  Category = "other"
)

type Status string

const (
	StatusPlanned   Status = "planned"
	StatusWatching  Status = "watching"
	StatusCompleted Status = "completed"
)

type Item struct {
	ID              string    `json:"id"`
	Title           string    `json:"title"`
	Category        Category  `json:"category"`
	Status          Status    `json:"status"`
	Rating          *int      `json:"rating"`
	Notes           string    `json:"notes"`
	Seasons         []Season  `json:"seasons"`
	TotalSeasons    int       `json:"totalSeasons"`
	TotalEpisodes   int       `json:"totalEpisodes"`
	WatchedEpisodes int       `json:"watchedEpisodes"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

type Season struct {
	ID              string `json:"id"`
	SeasonNumber    int    `json:"seasonNumber"`
	EpisodeCount    int    `json:"episodeCount"`
	WatchedEpisodes int    `json:"watchedEpisodes"`
}

type ListFilter struct {
	Category Category
	Status   Status
	Query    string
}

type UpsertItemInput struct {
	Title    string   `json:"title"`
	Category Category `json:"category"`
	Status   Status   `json:"status"`
	Rating   *int     `json:"rating"`
	Notes    string   `json:"notes"`
	Seasons  []Season `json:"seasons"`
}
