import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { categories, statuses } from '../model/contentOptions.jsx';

export function ContentFilters({
  activeCategory,
  search,
  statusFilter,
  onCategoryChange,
  onSearchChange,
  onStatusChange,
}) {
  return (
    <Box className="control-band">
      <Tabs
        value={activeCategory}
        onChange={(_, value) => onCategoryChange(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Tab
              key={category.value}
              value={category.value}
              icon={<Icon />}
              iconPosition="start"
              label={category.label}
            />
          );
        })}
      </Tabs>
      <Stack className="filters" direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          size="small"
          placeholder="Поиск по названию"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" className="status-select">
          <InputLabel>Статус</InputLabel>
          <Select
            label="Статус"
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
