import {
  AppBar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';

export function AppHeader({ onCreate }) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} className="topbar">
      <Toolbar className="toolbar">
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box className="brand-mark">
            <StarIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>Content Tracker</Typography>
            <Typography variant="caption" color="text.secondary">
              Фильмы, сериалы и аниме под рукой
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
          Добавить
        </Button>
      </Toolbar>
    </AppBar>
  );
}
