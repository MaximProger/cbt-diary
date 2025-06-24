import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setTheme } from '@/store/themeSlice';
import type { TRootState } from '@/store';

const useTheme = () => {
  const isDarkMode = useSelector((state: TRootState) => state.theme.isDarkMode);
  const dispatch = useDispatch();

  const toggle = () => dispatch(toggleTheme());
  const setMode = (darkMode: boolean) => dispatch(setTheme(darkMode));

  return { isDarkMode, toggle, setMode };
};

export default useTheme;
