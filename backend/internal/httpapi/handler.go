package httpapi

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"content-tracker/backend/internal/content"
)

type ContentService interface {
	List(ctx context.Context, filter content.ListFilter) ([]content.Item, error)
	Get(ctx context.Context, id string) (content.Item, error)
	Create(ctx context.Context, input content.UpsertItemInput) (content.Item, error)
	Update(ctx context.Context, id string, input content.UpsertItemInput) (content.Item, error)
	Delete(ctx context.Context, id string) error
}

type Handler struct {
	content ContentService
}

func NewHandler(contentService ContentService) *Handler {
	return &Handler{content: contentService}
}

func (h *Handler) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", h.handleHealth)
	mux.HandleFunc("/api/items", h.handleItems)
	mux.HandleFunc("/api/items/", h.handleItemByID)
	return mux
}

func (h *Handler) handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) handleItems(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.listItems(w, r)
	case http.MethodPost:
		h.createItem(w, r)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (h *Handler) handleItemByID(w http.ResponseWriter, r *http.Request) {
	id := strings.Trim(strings.TrimPrefix(r.URL.Path, "/api/items/"), "/")
	if id == "" || strings.Contains(id, "/") {
		writeError(w, http.StatusNotFound, "item not found")
		return
	}

	switch r.Method {
	case http.MethodGet:
		h.getItem(w, r, id)
	case http.MethodPut:
		h.updateItem(w, r, id)
	case http.MethodDelete:
		h.deleteItem(w, r, id)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (h *Handler) listItems(w http.ResponseWriter, r *http.Request) {
	items, err := h.content.List(r.Context(), content.ListFilter{
		Category: content.Category(r.URL.Query().Get("category")),
		Status:   content.Status(r.URL.Query().Get("status")),
		Query:    r.URL.Query().Get("q"),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load items")
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (h *Handler) getItem(w http.ResponseWriter, r *http.Request, id string) {
	item, err := h.content.Get(r.Context(), id)
	if handleContentError(w, err) {
		return
	}
	writeJSON(w, http.StatusOK, item)
}

func (h *Handler) createItem(w http.ResponseWriter, r *http.Request) {
	var input content.UpsertItemInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON")
		return
	}

	item, err := h.content.Create(r.Context(), input)
	if handleContentError(w, err) {
		return
	}
	writeJSON(w, http.StatusCreated, item)
}

func (h *Handler) updateItem(w http.ResponseWriter, r *http.Request, id string) {
	var input content.UpsertItemInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON")
		return
	}

	item, err := h.content.Update(r.Context(), id, input)
	if handleContentError(w, err) {
		return
	}
	writeJSON(w, http.StatusOK, item)
}

func (h *Handler) deleteItem(w http.ResponseWriter, r *http.Request, id string) {
	if handleContentError(w, h.content.Delete(r.Context(), id)) {
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func handleContentError(w http.ResponseWriter, err error) bool {
	if err == nil {
		return false
	}

	var validationErr content.ValidationError
	switch {
	case errors.As(err, &validationErr):
		writeError(w, http.StatusBadRequest, validationErr.Message)
	case errors.Is(err, content.ErrNotFound):
		writeError(w, http.StatusNotFound, "item not found")
	default:
		writeError(w, http.StatusInternalServerError, "internal server error")
	}
	return true
}
