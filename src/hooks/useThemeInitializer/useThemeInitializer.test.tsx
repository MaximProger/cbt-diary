import { renderHook } from '@testing-library/react';
import * as reduxHooks from 'react-redux';
import { vi } from 'vitest';
import useThemeInitializer from './useThemeInitializer';
import * as themeActions from '@/store/themeSlice';

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');
const mockedSelect = vi.spyOn(reduxHooks, 'useSelector');
const mockedSetTheme = vi.spyOn(themeActions, 'setTheme');
const mockClassList = {
  add: vi.fn(),
  remove: vi.fn(),
};

describe('useThemeInitializer', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  const mockGetItem = vi.fn();
  const mockSetItem = vi.fn();

  const setupMocks = (isDarkMode = false) => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(isDarkMode);
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: isDarkMode,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
      },
      writable: true,
    });
    Object.defineProperty(document, 'documentElement', {
      value: { classList: mockClassList },
      writable: true,
    });
    window.localStorage.getItem = mockGetItem;
    window.localStorage.setItem = mockSetItem;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('should initialize with saved dark theme from localstorage', () => {
    mockGetItem.mockReturnValue('dark');
    renderHook(() => useThemeInitializer());
    expect(mockedSetTheme).toHaveBeenCalledWith(true);
  });
  it('should initialize with saved light theme from localstorage', () => {
    mockGetItem.mockReturnValue('light');
    renderHook(() => useThemeInitializer());
    expect(mockedSetTheme).toHaveBeenCalledWith(false);
  });
  it('should initialize with system dark preference when no saved theme', () => {
    mockGetItem.mockReturnValue(null);
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    });
    renderHook(() => useThemeInitializer());
    expect(mockedSetTheme).toHaveBeenCalledWith(true);
  });
  it('should initialize with system light preference when no saved theme', () => {
    mockGetItem.mockReturnValue(null);
    renderHook(() => useThemeInitializer());
    expect(mockedSetTheme).toHaveBeenCalledWith(false);
  });
  it('should apply dark class to document root when dark mode is true', () => {
    setupMocks(true);
    renderHook(() => useThemeInitializer());
    expect(mockClassList.add).toHaveBeenCalledWith('dark');
  });
  it('should remove dark class from document root when dark mode is false', () => {
    renderHook(() => useThemeInitializer());
    expect(mockClassList.remove).toHaveBeenCalledWith('dark');
  });
  it('should save dark theme to localstorage when dark mode is true', () => {
    setupMocks(true);
    mockGetItem.mockReturnValue('dark');
    renderHook(() => useThemeInitializer());
    expect(mockSetItem).toHaveBeenCalledWith('theme', 'dark');
  });
  it('should save light theme to localstorage when dark mode is false', () => {
    setupMocks(false);
    mockGetItem.mockReturnValue('light');
    renderHook(() => useThemeInitializer());
    expect(mockSetItem).toHaveBeenCalledWith('theme', 'light');
  });
  it('should not re-initialize on subsequent renders', () => {
    mockGetItem.mockReturnValue('dark');
    const { rerender } = renderHook(() => useThemeInitializer());
    expect(mockGetItem).toHaveBeenCalledTimes(1);
    rerender();
    expect(mockGetItem).toHaveBeenCalledTimes(1);
  });
});
