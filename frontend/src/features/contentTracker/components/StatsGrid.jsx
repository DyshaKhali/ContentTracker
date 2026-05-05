import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';

export function StatsGrid({ selectedCategory, stats }) {
  return (
    <Grid2 container spacing={2.5} className="stats-row">
      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
        <StatBlock label={selectedCategory.label} value={stats.total} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
        <StatBlock label="Хочу посмотреть" value={stats.planned} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
        <StatBlock label="Смотрю сейчас" value={stats.watching} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
        <StatBlock label="Завершено" value={stats.completed} />
      </Grid2>
    </Grid2>
  );
}

function StatBlock({ label, value }) {
  return (
    <Box className="stat-block">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h4" fontWeight={900}>{value}</Typography>
    </Box>
  );
}
