import React, { type JSX, type PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { TRootState } from './store';

// Создайте mock store
const createTestStore = (preloadedState?: Partial<TRootState>) => {
  return configureStore({
    reducer: {
      // Добавьте ваши reducers
      // Например: dialog: dialogReducer,
    },
    preloadedState,
  });
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<TRootState>;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, store = createTestStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
