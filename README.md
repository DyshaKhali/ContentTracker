# Content Tracker

Content Tracker - локальное веб-приложение для учета фильмов, сериалов и аниме. Приложение помогает вести список того, что уже просмотрено, что находится в процессе просмотра и что хочется посмотреть позже.

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

Backend:
- Go
- net/http
- pgx

Database:
- PostgreSQL
- Docker Compose для локального запуска базы

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
  docker-compose.yml         # PostgreSQL для локальной разработки
  README.md
  .gitignore
```

## Требования

Перед запуском установи:

- Docker Desktop
- Go
- Node.js и npm

Проверь, что команды доступны:

```powershell
docker --version
go version
node --version
npm.cmd --version
```

## Быстрый запуск

Открой терминал в папке проекта:

```powershell
cd C:\dev\ContentTracker
```

Запусти PostgreSQL:

```powershell
docker compose up -d postgres
```

База будет доступна на `127.0.0.1:55432`. Внутри контейнера PostgreSQL работает на стандартном порту `5432`. Внешний порт `55432` выбран специально, чтобы не конфликтовать с уже установленным PostgreSQL на машине.

Запусти backend:

```powershell
cd C:\dev\ContentTracker\backend
go run ./cmd/server
```

Backend будет доступен на:

```text
http://127.0.0.1:8080
```

Проверка API:

```text
http://127.0.0.1:8080/api/health
```

В новом терминале запусти frontend:

```powershell
cd C:\dev\ContentTracker\frontend
npm.cmd install
npm.cmd run dev
```

Frontend будет доступен на:

```text
http://127.0.0.1:5173
```

## Остановка проекта

Остановить frontend/backend процессы:

```powershell
Get-Process node, go, server -ErrorAction SilentlyContinue | Stop-Process -Force
```

Остановить PostgreSQL контейнер:

```powershell
cd C:\dev\ContentTracker
docker compose down
```

Не используй `docker compose down -v`, если не хочешь удалить данные PostgreSQL.

## Переменные окружения backend

Backend использует значения по умолчанию, поэтому `.env` не обязателен для локального запуска.

Пример находится в:

```text
backend/.env.example
```

Доступные переменные:

- `DATABASE_URL` - строка подключения PostgreSQL
- `HTTP_ADDR` - адрес backend-сервера, по умолчанию `:8080`
- `FRONTEND_ORIGINS` - список разрешенных frontend origin для CORS через запятую

Значения по умолчанию:

```text
DATABASE_URL=postgres://content_tracker:content_tracker@127.0.0.1:55432/content_tracker?sslmode=disable
HTTP_ADDR=:8080
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

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

## Проверка перед коммитом

Backend:

```powershell
cd C:\dev\ContentTracker\backend
go test ./...
```

Frontend:

```powershell
cd C:\dev\ContentTracker\frontend
npm.cmd run build
```

## Подготовка к публикации на Git

Перед первым коммитом проверь статус:

```powershell
cd C:\dev\ContentTracker
git status
```

Файлы и папки вроде `node_modules`, `dist`, `.env`, логов и временных backend-бинарников уже добавлены в `.gitignore` и не должны попадать в репозиторий.

Если `node_modules` или `dist` уже были добавлены в индекс Git раньше, убери их из индекса без удаления с диска:

```powershell
git rm -r --cached frontend/node_modules frontend/dist
```

Затем можно сделать первый коммит:

```powershell
git add .
git commit -m "Initial Content Tracker project"
```
