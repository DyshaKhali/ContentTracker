import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { getStatus, statuses } from '../model/contentOptions.jsx';

export function ContentDetailsDrawer({
  item,
  saving,
  onAddSeason,
  onChange,
  onClose,
  onDelete,
  onSave,
  onSeasonChange,
}) {
  const status = item ? getStatus(item.status) : null;

  return (
    <Drawer anchor="right" open={Boolean(item)} onClose={onClose}>
      {item && (
        <Box className="details-drawer">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={900}>Карточка</Typography>
            <Tooltip title="Закрыть">
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <TextField
            label="Название"
            value={item.title}
            onChange={(event) => onChange({ title: event.target.value })}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              label="Статус"
              value={item.status}
              onChange={(event) => onChange({ status: event.target.value })}
            >
              {statuses.map((entry) => (
                <MenuItem key={entry.value} value={entry.value}>{entry.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={800}>Оценка</Typography>
              <Chip icon={<StarIcon />} label={item.rating ? `${item.rating}/10` : 'нет'} />
            </Stack>
            <Slider
              min={1}
              max={10}
              step={1}
              marks
              value={item.rating ?? 1}
              onChange={(_, value) => onChange({ rating: value })}
            />
          </Box>

          <Divider />

          {item.category === 'movie' ? (
            <Stack spacing={1.5}>
              <Typography color="text.secondary">
                Для фильма достаточно статуса и оценки.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                onClick={() => onChange({ status: 'completed' })}
              >
                Отметить просмотренным
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={900}>Сезоны и серии</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={onAddSeason}>Сезон</Button>
              </Stack>
              {item.seasons.map((season, index) => (
                <Box className="season-row" key={`${season.id ?? 'new'}-${season.seasonNumber}`}>
                  <Typography fontWeight={800}>Сезон {season.seasonNumber}</Typography>
                  <Stack direction="row" spacing={1.5}>
                    <TextField
                      label="Всего серий"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={season.episodeCount}
                      onChange={(event) => onSeasonChange(index, 'episodeCount', event.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Просмотрено"
                      type="number"
                      inputProps={{ min: 0, max: season.episodeCount || undefined }}
                      value={season.watchedEpisodes}
                      onChange={(event) => onSeasonChange(index, 'watchedEpisodes', event.target.value)}
                      fullWidth
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}

          <TextField
            label="Заметки"
            value={item.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            multiline
            minRows={4}
            fullWidth
          />

          <Box className="drawer-actions">
            <Tooltip title="Удалить">
              <IconButton color="error" onClick={onDelete} disabled={saving}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Stack direction="row" spacing={1}>
              <Button onClick={onClose}>Закрыть</Button>
              <Button variant="contained" onClick={onSave} disabled={saving || !item.title.trim()}>
                Сохранить
              </Button>
            </Stack>
          </Box>
          {status && <Chip className="drawer-status" label={status.label} color={status.color} />}
        </Box>
      )}
    </Drawer>
  );
}
