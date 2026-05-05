export function buildCreatePayload(form) {
  const seasonCount = Math.max(1, Number(form.seasonCount) || 1);
  const seasons = form.category === 'movie'
    ? []
    : Array.from({ length: seasonCount }, (_, index) => ({
      seasonNumber: index + 1,
      episodeCount: 0,
      watchedEpisodes: 0,
    }));

  return {
    title: form.title,
    category: form.category,
    status: form.status,
    rating: form.rating ? Number(form.rating) : null,
    notes: form.notes,
    seasons,
  };
}

export function buildUpdatePayload(item) {
  return {
    title: item.title,
    category: item.category,
    status: item.status,
    rating: item.rating,
    notes: item.notes,
    seasons: item.category === 'movie' ? [] : item.seasons,
  };
}
