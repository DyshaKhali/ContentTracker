import { getStatus } from '../model/contentOptions.jsx';

export function getProgress(item) {
  if (item.totalEpisodes > 0) {
    return Math.round((item.watchedEpisodes / item.totalEpisodes) * 100);
  }
  return item.status === 'completed' ? 100 : 0;
}

export function getProgressLabel(item) {
  if (item.category === 'movie') {
    return getStatus(item.status).label;
  }
  return `${item.watchedEpisodes}/${item.totalEpisodes || '?'} серий`;
}

export function calculateStats(items) {
  return items.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.status] += 1;
      return acc;
    },
    { total: 0, planned: 0, watching: 0, completed: 0 },
  );
}
