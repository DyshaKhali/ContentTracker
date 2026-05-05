import { Box, Typography } from '@mui/material';

export function EmptyState({ category }) {
  const Icon = category.icon;

  return (
    <Box className="empty-state">
      <Icon className="empty-icon" />
      <Typography variant="h5" fontWeight={800}>Список пока пуст</Typography>
      <Typography color="text.secondary">
        Добавь первое название и отмечай прогресс вручную.
      </Typography>
    </Box>
  );
}
