package config

import (
	"os"
	"strings"
)

type Config struct {
	DatabaseURL     string
	HTTPAddr        string
	FrontendOrigins []string
}

func Load() Config {
	return Config{
		DatabaseURL:     getEnv("DATABASE_URL", "postgres://content_tracker:content_tracker@127.0.0.1:55432/content_tracker?sslmode=disable"),
		HTTPAddr:        getEnv("HTTP_ADDR", ":8080"),
		FrontendOrigins: getCSVEnv("FRONTEND_ORIGINS", getEnv("FRONTEND_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173")),
	}
}

func getEnv(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func getCSVEnv(key, fallback string) []string {
	raw := getEnv(key, fallback)
	parts := strings.Split(raw, ",")
	values := make([]string, 0, len(parts))
	for _, part := range parts {
		value := strings.TrimSpace(part)
		if value != "" {
			values = append(values, value)
		}
	}
	return values
}
