import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createItem,
  deleteItem,
  getItem,
  listItems,
  updateItem,
} from '../api/contentApi.js';
import {
  emptyContentForm,
  getCategory,
} from '../model/contentOptions.jsx';
import { calculateStats } from '../utils/contentProgress.js';
import { buildCreatePayload, buildUpdatePayload } from '../utils/formMappers.js';

export function useContentTracker() {
  const [activeCategory, setActiveCategory] = useState('anime');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyContentForm);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listItems({ category: activeCategory, status: statusFilter });
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, statusFilter]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const selectedCategory = getCategory(activeCategory);
  const stats = useMemo(() => calculateStats(items), [items]);
  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return items;
    }
    return items.filter((item) => item.title.toLowerCase().includes(term));
  }, [items, search]);

  function openCreateDialog() {
    setForm({ ...emptyContentForm, category: activeCategory });
    setAddOpen(true);
  }

  async function createContentItem() {
    setSaving(true);
    setError('');
    try {
      const created = await createItem(buildCreatePayload(form));
      setAddOpen(false);
      setForm({ ...emptyContentForm, category: activeCategory });
      if (created.category === activeCategory) {
        await loadItems();
        setSelected(created);
      } else {
        setActiveCategory(created.category);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function selectItem(id) {
    setError('');
    try {
      setSelected(await getItem(id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveSelectedItem() {
    if (!selected) {
      return;
    }

    setSaving(true);
    setError('');
    try {
      const saved = await updateItem(selected.id, buildUpdatePayload(selected));
      setSelected(saved);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteSelectedItem() {
    if (!selected) {
      return;
    }

    setSaving(true);
    setError('');
    try {
      await deleteItem(selected.id);
      setSelected(null);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function updateSelected(patch) {
    setSelected((current) => ({ ...current, ...patch }));
  }

  function updateSeason(index, field, value) {
    setSelected((current) => {
      const seasons = current.seasons.map((season, seasonIndex) => {
        if (seasonIndex !== index) {
          return season;
        }

        const next = { ...season, [field]: Math.max(0, Number(value) || 0) };
        if (next.episodeCount > 0 && next.watchedEpisodes > next.episodeCount) {
          next.watchedEpisodes = next.episodeCount;
        }
        return next;
      });

      return { ...current, seasons };
    });
  }

  function addSeason() {
    setSelected((current) => {
      const nextNumber = current.seasons.length + 1;
      return {
        ...current,
        seasons: [
          ...current.seasons,
          { seasonNumber: nextNumber, episodeCount: 0, watchedEpisodes: 0 },
        ],
      };
    });
  }

  return {
    activeCategory,
    addOpen,
    error,
    form,
    items,
    loading,
    saving,
    search,
    selected,
    selectedCategory,
    stats,
    statusFilter,
    visibleItems,
    actions: {
      addSeason,
      closeCreateDialog: () => setAddOpen(false),
      closeDetails: () => setSelected(null),
      createContentItem,
      deleteSelectedItem,
      openCreateDialog,
      saveSelectedItem,
      selectItem,
      setActiveCategory,
      setForm,
      setSearch,
      setStatusFilter,
      updateSeason,
      updateSelected,
    },
  };
}
