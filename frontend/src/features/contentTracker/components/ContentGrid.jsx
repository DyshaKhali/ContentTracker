import { Box, CircularProgress } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { ContentCard } from './ContentCard.jsx';
import { EmptyState } from './EmptyState.jsx';

export function ContentGrid({
  category,
  items,
  loading,
  onSelect,
}) {
  if (loading) {
    return (
      <Box className="center-state">
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return <EmptyState category={category} />;
  }

  return (
    <Grid2 container spacing={2.5}>
      {items.map((item) => (
        <Grid2 key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <ContentCard item={item} onClick={() => onSelect(item.id)} />
        </Grid2>
      ))}
    </Grid2>
  );
}
