package content

import "strings"

func ValidateInput(input UpsertItemInput) error {
	if strings.TrimSpace(input.Title) == "" {
		return validationError("title is required")
	}
	if !input.Category.Valid() {
		return validationError("category must be anime, movie, series, book, game, or other")
	}
	if !input.Status.Valid() {
		return validationError("status must be planned, watching, or completed")
	}
	if input.Rating != nil && (*input.Rating < 1 || *input.Rating > 10) {
		return validationError("rating must be between 1 and 10")
	}
	if !input.Category.HasSeasons() && len(input.Seasons) > 0 {
		return validationError("this category cannot have seasons")
	}
	if input.Category.HasSeasons() && len(input.Seasons) == 0 {
		return validationError("anime and series need at least one season")
	}

	seen := map[int]bool{}
	for _, season := range input.Seasons {
		if season.SeasonNumber <= 0 {
			return validationError("season number must be positive")
		}
		if seen[season.SeasonNumber] {
			return validationError("season numbers must be unique")
		}
		seen[season.SeasonNumber] = true

		if season.EpisodeCount < 0 || season.WatchedEpisodes < 0 {
			return validationError("episodes cannot be negative")
		}
		if season.EpisodeCount > 0 && season.WatchedEpisodes > season.EpisodeCount {
			return validationError("watched episodes cannot be greater than episode count")
		}
	}

	return nil
}

func (c Category) Valid() bool {
	return c == CategoryAnime || c == CategoryMovie || c == CategorySeries || c == CategoryBook || c == CategoryGame || c == CategoryOther
}

func (c Category) HasSeasons() bool {
	return c == CategoryAnime || c == CategorySeries
}

func (s Status) Valid() bool {
	return s == StatusPlanned || s == StatusWatching || s == StatusCompleted
}
