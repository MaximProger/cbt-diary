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
        base: 'rounded-[8px] transition-[outline-color]',
        colors: {
          // gray: 'bg-(--bg-secondary) border-[1px] border-solid border-(--border-secondary) ',
          gray: 'bg-(--bg-quaternary) border-[1px] border-solid border-(--border-primary) text-(--text-tertiary)',
        },
      },
      textarea: {
        base: 'rounded-[8px] transition-[outline-color]',
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
  modal: {
    root: {
      base: 'bg-red-500',
    },
    content: {
      inner:
        'bg-(--bg-secondary) shadow-[0_1px_3px_var(--shadow-light)] border-[1px] border-solid border-(--border-primary) rounded-[12px]',
    },
    header: {
      base: 'p-[20px] border-(--border-primary)',
      title: 'text-lg font-semibold text-(--brand-secondary)',
      close: {
        base: 'cursor-pointer transition-colors',
      },
    },
    body: {
      base: 'p-[20px]',
    },
    footer: {
      base: 'p-[20px] border-(--border-primary)',
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
