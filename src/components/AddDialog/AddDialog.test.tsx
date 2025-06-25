import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddDialog from './AddDialog';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as dialogActions from '@/store/dialogSlice';
import * as entryActions from '@/store/entrySlice';
import { user } from '@/__mocks__/mockUser';

const TEST_FIELD_VALUE = 'Test';
const SUCCESS_TOAST_MESSAGE = 'Запись успешно добавлена!';
const ERROR_TOAST_MESSAGE = 'Произошла ошибка при добавлении записи!';
const entry = {
  created_at: expect.any(String),
  created_by: user.id,
  worst_case: TEST_FIELD_VALUE,
  worst_consequences: TEST_FIELD_VALUE,
  what_can_i_do: TEST_FIELD_VALUE,
  how_will_i_cope: TEST_FIELD_VALUE,
};

const fillForm = async (value: string = TEST_FIELD_VALUE) => {
  fireEvent.change(screen.getByTestId('worstCase'), {
    target: {
      value: value,
    },
  });
  fireEvent.change(screen.getByTestId('worstConsequences'), {
    target: {
      value: value,
    },
  });
  fireEvent.change(screen.getByTestId('whatCanIDo'), {
    target: {
      value: value,
    },
  });
  fireEvent.change(screen.getByTestId('howWillICope'), {
    target: {
      value: value,
    },
  });
};

const mockToast = {
  success: vi.fn(),
  danger: vi.fn(),
};

vi.mock('@/hooks/useToast/useToast', () => ({
  default: () => mockToast,
}));
vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');
const mockedSelect = vi.spyOn(reduxHooks, 'useSelector');

describe('AddDialog', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const setupMocks = (isDialogOpen = true) => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(isDialogOpen);
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
      render(<AddDialog user={user} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render modal when isShowDialog is false', () => {
      setupMocks(false);
      render(<AddDialog user={user} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls closeDialog when modal is closed', () => {
      const mockedCloseDialog = vi.spyOn(dialogActions, 'closeDialog');
      render(<AddDialog user={user} />);

      fireEvent.click(screen.getByTestId('close-btn'));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(mockedCloseDialog).toHaveBeenCalledWith('isOpenAddDialog');
    });
  });

  describe('Form behavior', () => {
    it('displays all four form fields with correct labels', () => {
      render(<AddDialog user={user} />);

      expect(screen.getByLabelText('Что самое худшее может случиться в этой ситуации')).toBeInTheDocument();
      expect(screen.getByLabelText('Какие самые плохие последствия могут быть у этой ситуации')).toBeInTheDocument();
      expect(screen.getByLabelText('Что я смогу сделать в этой ситуации')).toBeInTheDocument();
      expect(screen.getByLabelText('Как я справлюсь')).toBeInTheDocument();

      expect(screen.getByTestId('worstCase')).toBeInTheDocument();
      expect(screen.getByTestId('worstConsequences')).toBeInTheDocument();
      expect(screen.getByTestId('whatCanIDo')).toBeInTheDocument();
      expect(screen.getByTestId('howWillICope')).toBeInTheDocument();

      const textareas = screen.getAllByRole('textbox');
      expect(textareas).toHaveLength(4);
    });

    it('disables submit button when form is invalid', () => {
      render(<AddDialog user={user} />);

      expect(screen.getByTestId('submit')).toHaveTextContent('Создать');
      expect(screen.getByTestId('submit')).toBeDisabled();
    });

    it('enables submit button when all required fields are filled', async () => {
      render(<AddDialog user={user} />);

      await fillForm();

      expect(screen.getByTestId('submit')).toHaveTextContent('Создать');
      await waitFor(() => {
        expect(screen.getByTestId('submit')).not.toBeDisabled();
      });
    });
  });

  describe('Submission handling', () => {
    it('shows loading state when submitting form', async () => {
      let resolvePromise: (value: unknown) => void;
      const unwrapMock = vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
      );
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<AddDialog user={user} />);
      await fillForm();

      await waitFor(() => {
        expect(screen.getByTestId('submit')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(screen.getByTestId('submit')).toHaveTextContent('Создание...');
        expect(screen.getByTestId('submit')).toBeDisabled();
      });

      resolvePromise!(entry);
    });

    it('calls createEntry with correct data on form submission', async () => {
      const mockedCreateEntry = vi.spyOn(entryActions, 'createEntry');
      const unwrapMock = vi.fn().mockResolvedValue(entry);
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<AddDialog user={user} />);
      await fillForm();

      await waitFor(() => {
        expect(screen.getByTestId('submit')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(mockedCreateEntry).toHaveBeenCalledTimes(1);
        expect(mockedCreateEntry).toHaveBeenCalledWith(entry);
      });
    });

    it('shows success toast on successful submission', async () => {
      const unwrapMock = vi.fn().mockResolvedValue(entry);
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<AddDialog user={user} />);
      await fillForm();

      await waitFor(() => {
        expect(screen.getByTestId('submit')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(SUCCESS_TOAST_MESSAGE);
      });
    });

    it('shows error toast on failed submission', async () => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const unwrapMock = vi.fn().mockRejectedValue(new Error('Submission failed'));
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<AddDialog user={user} />);
      await fillForm();

      await waitFor(() => {
        expect(screen.getByTestId('submit')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(mockToast.danger).toHaveBeenCalledWith(ERROR_TOAST_MESSAGE);
      });
    });

    it('resets form after successful submission', async () => {
      const unwrapMock = vi.fn().mockResolvedValue(entry);
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<AddDialog user={user} />);
      await fillForm();

      await waitFor(() => {
        expect(screen.getByTestId('submit')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).not.toHaveValue();
        expect(screen.getByTestId('worstConsequences')).not.toHaveValue();
        expect(screen.getByTestId('whatCanIDo')).not.toHaveValue();
        expect(screen.getByTestId('howWillICope')).not.toHaveValue();
        expect(screen.getByTestId('submit')).toBeDisabled();
        expect(screen.getByTestId('submit')).toHaveTextContent('Создать');
      });
    });

    it('closes modal after successful submission', async () => {
      const unwrapMock = vi.fn().mockResolvedValue(entry);
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<AddDialog user={user} />);
      await fillForm();

      await waitFor(() => {
        expect(screen.getByTestId('submit')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining('closeDialog'),
          }),
        );
      });
    });
  });
});
