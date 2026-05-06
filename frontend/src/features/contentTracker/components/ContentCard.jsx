import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { getStatus, hasSeasons } from '../model/contentOptions.jsx';
import { getProgress, getProgressLabel } from '../utils/contentProgress.js';

export function ContentCard({ item, onClick }) {
  const status = getStatus(item.status);
  const StatusIcon = status.icon;

  return (
    <Card className="content-card">
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box className={`poster-token poster-${item.category}`}>
              {item.title.slice(0, 2).toUpperCase()}
            </Box>
            <Chip size="small" icon={<StatusIcon />} label={status.label} color={status.color} />
          </Stack>
          <Typography variant="h6" className="card-title">{item.title}</Typography>
          <Stack direction="row" spacing={1} className="card-meta">
            {item.rating ? (
              <Chip size="small" icon={<StarIcon />} label={`${item.rating}/10`} />
            ) : (
              <Chip size="small" label="Без оценки" />
            )}
            {hasSeasons(item.category) && (
              <Chip size="small" label={`${item.totalSeasons} сез.`} />
            )}
          </Stack>
          <Box className="progress-area">
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">Прогресс</Typography>
              <Typography variant="caption" fontWeight={700}>{getProgressLabel(item)}</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={getProgress(item)} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
