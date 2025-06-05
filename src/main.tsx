import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App.tsx';
import { createTheme, ThemeProvider } from 'flowbite-react';

const customTheme = createTheme({
  button: {
    base: 'cursor-pointer transition-colors',
    color: {
      default: 'bg-(--brand-primary) hover:bg-(--brand-primary-hover)',
      red: 'bg-(--danger) hover:bg-(--danger-hover)',
      gray: 'bg-(--bg-tertiary) hover:bg-(--border-primary) text-(--text-secondary)',
      green: 'bg-(--success) hover:bg-(--success-hover)',
    },
  },
  textInput: {
    field: {
      input: {
        colors: {
          gray: 'bg-(--bg-secondary) border-[1px] border-solid border-(--border-secondary) rounded-[8px]',
        },
      },
    },
  },
  select: {
    field: {
      select: {
        base: 'cursor-pointer',
        colors: {
          gray: 'bg-(--bg-secondary) border-[1px] border-solid border-(--border-secondary) rounded-[8px]',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={customTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
