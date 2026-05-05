import { Alert, Box, Container } from '@mui/material';
import { AddContentDialog } from './components/AddContentDialog.jsx';
import { AppHeader } from './components/AppHeader.jsx';
import { ContentDetailsDrawer } from './components/ContentDetailsDrawer.jsx';
import { ContentFilters } from './components/ContentFilters.jsx';
import { ContentGrid } from './components/ContentGrid.jsx';
import { StatsGrid } from './components/StatsGrid.jsx';
import { useContentTracker } from './hooks/useContentTracker.js';

export function ContentTrackerPage() {
  const state = useContentTracker();
  const { actions } = state;

  return (
    <Box className="app-shell">
      <AppHeader onCreate={actions.openCreateDialog} />

      <Container maxWidth="xl" className="main-content">
        <ContentFilters
          activeCategory={state.activeCategory}
          search={state.search}
          statusFilter={state.statusFilter}
          onCategoryChange={actions.setActiveCategory}
          onSearchChange={actions.setSearch}
          onStatusChange={actions.setStatusFilter}
        />

        {state.error && <Alert severity="error" className="notice">{state.error}</Alert>}

        <StatsGrid selectedCategory={state.selectedCategory} stats={state.stats} />

        <ContentGrid
          category={state.selectedCategory}
          items={state.visibleItems}
          loading={state.loading}
          onSelect={actions.selectItem}
        />
      </Container>

      <AddContentDialog
        open={state.addOpen}
        form={state.form}
        saving={state.saving}
        onClose={actions.closeCreateDialog}
        onChange={actions.setForm}
        onSubmit={actions.createContentItem}
      />

      <ContentDetailsDrawer
        item={state.selected}
        saving={state.saving}
        onAddSeason={actions.addSeason}
        onChange={actions.updateSelected}
        onClose={actions.closeDetails}
        onDelete={actions.deleteSelectedItem}
        onSave={actions.saveSelectedItem}
        onSeasonChange={actions.updateSeason}
      />
    </Box>
  );
}
