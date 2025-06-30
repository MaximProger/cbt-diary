import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import useTheme from './useTheme';
import * as themeActions from '@/store/themeSlice';
import { renderHook } from '@testing-library/react';

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');
const mockedSelect = vi.spyOn(reduxHooks, 'useSelector');

describe('useTheme', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  const setupMocks = (isDarkMode = false) => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(isDarkMode);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('should return current isDarkMode state from redux store', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDarkMode).toBeFalsy();
  });

  it('should toggle theme and update isDarkMode value', () => {
    const mockedToggleTheme = vi.spyOn(themeActions, 'toggleTheme');
    const { result, rerender } = renderHook(() => useTheme());
    result.current.toggle();
    expect(mockedToggleTheme).toHaveBeenCalled();
    mockedSelect.mockReturnValue(true);
    rerender();
    expect(result.current.isDarkMode).toBeTruthy();
  });

  it('should set theme mode and update isDarkMode value', () => {
    const mockedSetTheme = vi.spyOn(themeActions, 'setTheme');
    const { result, rerender } = renderHook(() => useTheme());
    result.current.setMode(true);
    expect(mockedSetTheme).toHaveBeenCalledWith(true);
    mockedSelect.mockReturnValue(true);
    rerender();
    expect(result.current.isDarkMode).toBeTruthy();
  });
});
