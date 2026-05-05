package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"time"

	"content-tracker/backend/internal/config"
	"content-tracker/backend/internal/content"
	"content-tracker/backend/internal/database"
	"content-tracker/backend/internal/httpapi"
)

func main() {
	ctx := context.Background()
	cfg := config.Load()

	db, err := database.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	if err := database.Migrate(ctx, db); err != nil {
		log.Fatalf("migrate database: %v", err)
	}

	store := content.NewPostgresStore(db)
	service := content.NewService(store)
	handler := httpapi.NewHandler(service)

	server := &http.Server{
		Addr:              cfg.HTTPAddr,
		Handler:           httpapi.WithCORS(handler.Routes(), cfg.FrontendOrigins),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("Content Tracker API listening on %s", cfg.HTTPAddr)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("listen: %v", err)
	}
}
