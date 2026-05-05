import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { categories, statuses } from '../model/contentOptions.jsx';

export function AddContentDialog({
  form,
  open,
  saving,
  onChange,
  onClose,
  onSubmit,
}) {
  const canSubmit = form.title.trim() && !saving;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить контент</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Название"
            value={form.title}
            onChange={(event) => onChange({ ...form, title: event.target.value })}
            autoFocus
            fullWidth
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Раздел</InputLabel>
              <Select
                label="Раздел"
                value={form.category}
                onChange={(event) => onChange({ ...form, category: event.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>{category.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                label="Статус"
                value={form.status}
                onChange={(event) => onChange({ ...form, status: event.target.value })}
              >
                {statuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {form.category !== 'movie' && (
            <TextField
              label="Количество сезонов"
              type="number"
              inputProps={{ min: 1 }}
              value={form.seasonCount}
              onChange={(event) => onChange({ ...form, seasonCount: event.target.value })}
            />
          )}
          <TextField
            label="Оценка"
            type="number"
            inputProps={{ min: 1, max: 10 }}
            value={form.rating}
            onChange={(event) => onChange({ ...form, rating: event.target.value })}
          />
          <TextField
            label="Заметки"
            value={form.notes}
            onChange={(event) => onChange({ ...form, notes: event.target.value })}
            multiline
            minRows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" disabled={!canSubmit} onClick={onSubmit}>Создать</Button>
      </DialogActions>
    </Dialog>
  );
}
