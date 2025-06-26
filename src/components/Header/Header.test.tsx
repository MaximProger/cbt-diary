import { fireEvent, render, screen } from '@testing-library/react';
import Header from './Header';
import { vi } from 'vitest';
import * as dialogActions from '@/store/dialogSlice';
import * as reduxHooks from 'react-redux';
import useTheme from '@/hooks/useTheme/useTheme';
import { mockSession } from '@/__mocks__';
import { supabase } from '@/supabaseClient';

vi.mock('react-redux');
vi.mock('@/hooks/useTheme/useTheme');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');

const mockToggle = vi.fn();
const mockSetMode = vi.fn();
vi.mocked(useTheme).mockReturnValue({
  isDarkMode: false,
  toggle: mockToggle,
  setMode: mockSetMode,
});

describe('Header', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  const setupMocks = () => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
      toggle: mockToggle,
      setMode: mockSetMode,
    });
  });

  describe('common functionality', () => {
    it('renders header with correct title link', () => {
      render(<Header session={null} />);
      const logo = screen.getByTestId('logo');
      expect(logo).toHaveTextContent('Дневник катастрофизации');
      expect(logo).toHaveAttribute('href', '/');
    });

    it('opens info dialog when info button clicked', () => {
      const mockedOpenDialog = vi.spyOn(dialogActions, 'openDialog');
      render(<Header session={null} />);
      const infoBtn = screen.getByRole('button', { name: /Информация/i });
      fireEvent.click(infoBtn);
      expect(mockedOpenDialog).toHaveBeenCalledTimes(1);
      expect(mockedOpenDialog).toHaveBeenCalledWith('isOpenInfoDialog');
    });

    it('toggles theme when theme button clicked', () => {
      render(<Header session={null} />);
      const themeBtn = screen.getByRole('button', { name: /Переключить тему/i });
      fireEvent.click(themeBtn);
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('shows dark mode icon when theme is light', () => {
      render(<Header session={null} />);
      expect(screen.getByTestId('dark_mode_icon')).toBeInTheDocument();
      expect(screen.queryByTestId('light_mode_icon')).not.toBeInTheDocument();
    });

    it('shows light mode icon when theme is dark', () => {
      vi.mocked(useTheme).mockReturnValue({
        isDarkMode: true,
        toggle: mockToggle,
        setMode: mockSetMode,
      });

      render(<Header session={null} />);
      expect(screen.getByTestId('light_mode_icon')).toBeInTheDocument();
      expect(screen.queryByTestId('dark_mode_icon')).not.toBeInTheDocument();
    });

    it('renders all buttons with proper aria labels', () => {
      render(<Header session={null} />);
      expect(screen.getByRole('button', { name: /Переключить тему/i })).toHaveAttribute(
        'aria-label',
        'Переключить тему',
      );
      expect(screen.getByRole('button', { name: /Информация/i })).toHaveAttribute('aria-label', 'Информация');
      expect(screen.getByRole('button', { name: /Войти/i })).toHaveAttribute('aria-label', 'Войти');
      render(<Header session={mockSession} />);
      expect(screen.getByRole('button', { name: /Выйти/i })).toHaveAttribute('aria-label', 'Выйти');
    });

    it('shows text labels on desktop and icons on mobile', () => {
      render(<Header session={null} />);
      expect(screen.getByTestId('login_text')).toHaveClass('max-md:hidden');
      expect(screen.getByTestId('login_icon')).toHaveClass('hidden max-md:block');
      render(<Header session={mockSession} />);
      expect(screen.getByTestId('logout_text')).toHaveClass('max-md:hidden');
      expect(screen.getByTestId('logout_icon')).toHaveClass('hidden max-md:block');
    });
  });

  describe('when user is not logged in', () => {
    it('shows login button when no session', () => {
      render(<Header session={null} />);
      const loginBtn = screen.getByRole('button', { name: /Войти/i });
      expect(loginBtn).toBeInTheDocument();
      expect(loginBtn).toHaveTextContent('Войти');
    });

    it('opens auth dialog when login button clicked', () => {
      const mockedOpenDialog = vi.spyOn(dialogActions, 'openDialog');
      render(<Header session={null} />);
      const loginBtn = screen.getByRole('button', { name: /Войти/i });
      fireEvent.click(loginBtn);
      expect(mockedOpenDialog).toHaveBeenCalledTimes(1);
      expect(mockedOpenDialog).toHaveBeenCalledWith('isOpenAuthDialog');
    });
  });

  describe('when user is logged in', () => {
    it('displays user email when session exists', () => {
      render(<Header session={mockSession} />);
      expect(screen.getByText(mockSession.user.email)).toBeInTheDocument();
    });

    it('shows logout button when session exists', () => {
      render(<Header session={mockSession} />);
      const logoutBtn = screen.getByRole('button', { name: /Выйти/i });
      expect(logoutBtn).toBeInTheDocument();
      expect(logoutBtn).toHaveTextContent('Выйти');
    });

    it('calls logout function when logout button clicked', () => {
      vi.mock('@/supabaseClient', () => ({
        supabase: {
          auth: {
            signOut: vi.fn(),
          },
        },
      }));

      render(<Header session={mockSession} />);
      const logoutBtn = screen.getByRole('button', { name: /Выйти/i });
      fireEvent.click(logoutBtn);
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
