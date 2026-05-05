import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import App from './app/App.jsx';
import { theme } from './app/theme.js';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
