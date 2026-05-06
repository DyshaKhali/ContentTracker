import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

export const categories = [
  { value: 'anime', label: 'Аниме', icon: AutoStoriesIcon },
  { value: 'movie', label: 'Фильмы', icon: LocalMoviesIcon },
  { value: 'series', label: 'Сериалы', icon: LiveTvIcon },
  { value: 'book', label: 'Книги', icon: MenuBookIcon },
  { value: 'game', label: 'Игры', icon: SportsEsportsIcon },
  { value: 'other', label: 'Другое', icon: MoreHorizIcon },
];

export const statuses = [
  { value: 'planned', label: 'Хочу посмотреть', icon: WatchLaterIcon, color: 'default' },
  { value: 'watching', label: 'Смотрю', icon: PlayCircleIcon, color: 'warning' },
  { value: 'completed', label: 'Просмотрено', icon: CheckCircleIcon, color: 'success' },
];

export const emptyContentForm = {
  title: '',
  category: 'anime',
  status: 'planned',
  rating: '',
  notes: '',
  seasonCount: 1,
};

export function hasSeasons(category) {
  return category === 'anime' || category === 'series';
}

export function getStatus(value) {
  return statuses.find((status) => status.value === value) ?? statuses[0];
}

export function getCategory(value) {
  return categories.find((category) => category.value === value) ?? categories[0];
}