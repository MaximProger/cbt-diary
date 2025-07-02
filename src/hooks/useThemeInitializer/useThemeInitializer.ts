import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/store/themeSlice';
import type { TRootState } from '@/store';

const useThemeInitializer = () => {
  const isDarkMode = useSelector((state: TRootState) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const isInitialized = useRef(false);

  // Инициализация темы при первом рендере
  useEffect(() => {
    if (isInitialized.current) return;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      dispatch(setTheme(savedTheme === 'dark'));
    } else {
      dispatch(setTheme(systemPrefersDark));
    }

    isInitialized.current = true;
  }, [dispatch]);

  // Применение темы к DOM и сохранение в localStorage
  useEffect(() => {
    // Не применяем изменения до инициализации
    if (!isInitialized.current) return;

    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
};

export default useThemeInitializer;
