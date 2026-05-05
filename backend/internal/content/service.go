package content

import (
	"context"
	"strings"
)

type Store interface {
	List(ctx context.Context, filter ListFilter) ([]Item, error)
	Get(ctx context.Context, id string) (Item, error)
	Create(ctx context.Context, input UpsertItemInput) (Item, error)
	Update(ctx context.Context, id string, input UpsertItemInput) (Item, error)
	Delete(ctx context.Context, id string) error
}

type Service struct {
	store Store
}

func NewService(store Store) *Service {
	return &Service{store: store}
}

func (s *Service) List(ctx context.Context, filter ListFilter) ([]Item, error) {
	filter.Query = strings.TrimSpace(filter.Query)
	return s.store.List(ctx, filter)
}

func (s *Service) Get(ctx context.Context, id string) (Item, error) {
	return s.store.Get(ctx, id)
}

func (s *Service) Create(ctx context.Context, input UpsertItemInput) (Item, error) {
	input = normalizeInput(input)
	if err := ValidateInput(input); err != nil {
		return Item{}, err
	}
	return s.store.Create(ctx, input)
}

func (s *Service) Update(ctx context.Context, id string, input UpsertItemInput) (Item, error) {
	input = normalizeInput(input)
	if err := ValidateInput(input); err != nil {
		return Item{}, err
	}
	return s.store.Update(ctx, id, input)
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.store.Delete(ctx, id)
}

func normalizeInput(input UpsertItemInput) UpsertItemInput {
	input.Title = strings.TrimSpace(input.Title)
	input.Notes = strings.TrimSpace(input.Notes)
	if input.Status == "" {
		input.Status = StatusPlanned
	}
	if input.Category == CategoryMovie {
		input.Seasons = nil
	}
	return input
}
