# Content Tracker

Content Tracker - веб-приложение для учета фильмов, сериалов и аниме. Оно помогает вести список просмотренного, отмечать прогресс по сезонам и сериям, ставить оценки и сохранять то, что хочется посмотреть позже.

## Возможности

- Разделы: Аниме, Фильмы, Сериалы
- Статусы: Хочу посмотреть, Смотрю, Просмотрено
- Оценка от 1 до 10
- Ручное добавление названий
- Для аниме и сериалов: сезоны, количество серий и просмотренные серии
- Для фильмов: статус и оценка без сезонной структуры
- Поиск по названию
- Фильтр по статусу
- Создание, редактирование и удаление записей

## Стек

Frontend:
- React
- Material UI
- Vite
- Nginx в Docker-контейнере

Backend:
- Go
- net/http
- pgx

Database:
- PostgreSQL
- Docker Compose

## Структура проекта

```text
ContentTracker/
  backend/
    cmd/server/              # точка входа backend-приложения
    internal/config/         # конфигурация окружения
    internal/database/       # подключение к PostgreSQL и миграции
    internal/content/        # доменная логика, валидация, repository
    internal/httpapi/        # HTTP routes, CORS, JSON responses
  frontend/
    src/app/                 # корневой компонент и MUI theme
    src/shared/api/          # общий HTTP-клиент
    src/features/contentTracker/
      api/                   # запросы к API
      components/            # UI-компоненты
      hooks/                 # состояние и сценарии страницы
      model/                 # статусы, категории, дефолтные формы
      utils/                 # расчет прогресса и маппинг payload
  data/postgres/             # локальные данные PostgreSQL, не коммитятся
  docker-compose.yml
  .env.example
  README.md
  .gitignore
```

## Требования

Для запуска нужен Docker Desktop.

## Настройка окружения

Создай локальный `.env` в корне проекта на основе `.env.example`:

```powershell
cd C:\dev\ContentTracker
copy .env.example .env
```

В `.env` хранятся локальные настройки PostgreSQL, включая пароль пользователя базы. Этот файл добавлен в `.gitignore` и не должен попадать в Git.

## Запуск одной командой

```powershell
cd C:\dev\ContentTracker
docker compose up --build
```

После запуска:

- Frontend: http://127.0.0.1:5173
- Backend healthcheck: http://127.0.0.1:8080/api/health
- PostgreSQL: 127.0.0.1:55432

Данные PostgreSQL сохраняются локально в папке:

```text
data/postgres/
```

Эта папка примонтирована в контейнер PostgreSQL и добавлена в `.gitignore`, поэтому база сохраняется между перезапусками, но не коммитится в репозиторий.

## Остановка проекта

Остановить контейнеры:

```powershell
docker compose down
```

Не используй `docker compose down -v`, если не хочешь удалить данные базы.

## Где лежат настройки PostgreSQL

Локальные значения лежат в файле `.env` в корне проекта:

```text
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
```

В Git должен попадать только `.env.example`, где пароль указан как пример, а не реальный секрет.

## API

Основные endpoint'ы:

```text
GET    /api/health
GET    /api/items
POST   /api/items
GET    /api/items/{id}
PUT    /api/items/{id}
DELETE /api/items/{id}
```

Фильтры списка:

```text
GET /api/items?category=anime&status=planned&q=naruto
```

Категории:

- `anime`
- `movie`
- `series`

Статусы:

- `planned`
- `watching`
- `completed`