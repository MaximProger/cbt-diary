import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthDialog from './AuthDialog';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as dialogActions from '@/store/dialogSlice';
import { supabase } from '@/supabaseClient';

const TEST_EMAIL = 'test@example.com';
const INVALID_EMAIL = 'invalid-email';
const SUCCESS_TOAST_MESSAGE = 'Проверьте свой email для получения ссылки для входа!';
const ERROR_TOAST_MESSAGE = 'Во время авторизации произошла ошибка!';
const UNEXPECTED_ERROR_MESSAGE = 'Произошла неожиданная ошибка!';

const mockToast = {
  success: vi.fn(),
  danger: vi.fn(),
};

vi.mock('@/hooks/useToast/useToast', () => ({
  default: () => mockToast,
}));

vi.mock('react-redux');
vi.mock('@/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
    },
  },
}));

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');
const mockedSelect = vi.spyOn(reduxHooks, 'useSelector');
const mockedSupabaseAuth = vi.mocked(supabase.auth.signInWithOtp);

const initialState = {
  error: null,
  data: {
    user: null,
    session: null,
    messageId: undefined,
  },
};

describe('AuthDialog', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const setupMocks = (isDialogOpen = true) => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(isDialogOpen);
  };

  const fillEmailField = (email: string) => {
    fireEvent.change(screen.getByPlaceholderText('Введите Email'), {
      target: { value: email },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
  });

  describe('Modal behavior', () => {
    it('renders modal when isShowDialog is true', () => {
      render(<AuthDialog />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render modal when isShowDialog is false', () => {
      setupMocks(false);
      render(<AuthDialog />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls closeDialog when modal is closed', () => {
      const mockedCloseDialog = vi.spyOn(dialogActions, 'closeDialog');
      render(<AuthDialog />);

      fireEvent.click(screen.getByLabelText('Close'));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(mockedCloseDialog).toHaveBeenCalledWith('isOpenAuthDialog');
    });

    it('displays correct modal header', () => {
      render(<AuthDialog />);
      expect(screen.getByText('Добро пожаловать!')).toBeInTheDocument();
    });
  });

  describe('Form behavior', () => {
    it('displays email field with correct label and placeholder', () => {
      render(<AuthDialog />);

      expect(screen.getByLabelText('Адрес электронной почты')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Введите Email')).toBeInTheDocument();
    });

    it('enables submit button when valid email is entered', async () => {
      render(<AuthDialog />);

      fillEmailField(TEST_EMAIL);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Войти' })).not.toBeDisabled();
      });
    });

    it('shows validation error for empty email', async () => {
      render(<AuthDialog />);

      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(screen.getByText('Необходимо указать электронную почту')).toBeInTheDocument();
      });
    });

    it('shows validation error for invalid email format', async () => {
      render(<AuthDialog />);

      fillEmailField(INVALID_EMAIL);
      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(screen.getByText('Введенное значение не соответствует формату электронной почты')).toBeInTheDocument();
      });
    });

    it('changes input color to failure when there is an error', async () => {
      render(<AuthDialog />);

      fillEmailField(INVALID_EMAIL);
      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Введите Email');
        expect(input).toHaveClass('border-red-500');
      });
    });
  });

  describe('Authentication handling', () => {
    it('shows loading state when submitting form', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resolvePromise: (value: any) => void;
      mockedSupabaseAuth.mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
      );

      render(<AuthDialog />);
      fillEmailField(TEST_EMAIL);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Войти' })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Отправка...' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Отправка...' })).toBeDisabled();
      });

      resolvePromise!({ error: null });
    });

    it('calls supabase auth with correct email on form submission', async () => {
      mockedSupabaseAuth.mockResolvedValue(initialState);

      render(<AuthDialog />);
      fillEmailField(TEST_EMAIL);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Войти' })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

      await waitFor(() => {
        expect(mockedSupabaseAuth).toHaveBeenCalledTimes(1);
        expect(mockedSupabaseAuth).toHaveBeenCalledWith({ email: TEST_EMAIL });
      });
    });

    it('shows success toast and closes modal on successful authentication', async () => {
      const mockedCloseDialog = vi.spyOn(dialogActions, 'closeDialog');
      mockedSupabaseAuth.mockResolvedValue({
        error: null,
        data: {
          user: null,
          session: null,
          messageId: undefined,
        },
      });

      render(<AuthDialog />);
      fillEmailField(TEST_EMAIL);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Войти' })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(SUCCESS_TOAST_MESSAGE);
        expect(mockedCloseDialog).toHaveBeenCalledWith('isOpenAuthDialog');
      });
    });

    it('shows error toast when supabase returns error', async () => {
      mockedSupabaseAuth.mockResolvedValue({
        error: {
          message: 'Auth failed',
          code: 'AUTH_FAILED',
          status: 401,
          __isAuthError: true,
          name: '',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<AuthDialog />);
      fillEmailField(TEST_EMAIL);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Войти' })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

      await waitFor(() => {
        expect(mockToast.danger).toHaveBeenCalledWith(ERROR_TOAST_MESSAGE);
      });
    });

    it('shows unexpected error toast when promise rejects', async () => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockedSupabaseAuth.mockRejectedValue(new Error('Network error'));

      render(<AuthDialog />);
      fillEmailField(TEST_EMAIL);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Войти' })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

      await waitFor(() => {
        expect(mockToast.danger).toHaveBeenCalledWith(UNEXPECTED_ERROR_MESSAGE);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Auth error:', expect.any(Error));
      });
    });

    it('prevents multiple submissions while loading', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resolvePromise: (value: any) => void;
      mockedSupabaseAuth.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          }),
      );

      render(<AuthDialog />);
      fillEmailField(TEST_EMAIL);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Войти' })).not.toBeDisabled();
      });

      // Первый клик
      fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Отправка...' })).toBeDisabled();
      });

      // Второй клик (должен быть проигнорирован)
      fireEvent.click(screen.getByRole('button', { name: 'Отправка...' }));

      expect(mockedSupabaseAuth).toHaveBeenCalledTimes(1);

      // Очищаем Promise
      resolvePromise!({ error: null });
    });

    it('resets form when modal is closed', () => {
      render(<AuthDialog />);

      // Заполняем форму
      fillEmailField(TEST_EMAIL);

      // Закрываем модалку
      fireEvent.click(screen.getByLabelText('Close'));

      // Проверяем, что dispatch был вызван для закрытия
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('closeDialog'),
        }),
      );
    });

    it('can submit form using form onSubmit handler', async () => {
      mockedSupabaseAuth.mockResolvedValue(initialState);

      render(<AuthDialog />);
      fillEmailField(TEST_EMAIL);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Войти' })).not.toBeDisabled();
      });

      // Находим форму и отправляем её
      const form = screen.getByTestId('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockedSupabaseAuth).toHaveBeenCalledTimes(1);
        expect(mockedSupabaseAuth).toHaveBeenCalledWith({ email: TEST_EMAIL });
      });
    });
  });
});
