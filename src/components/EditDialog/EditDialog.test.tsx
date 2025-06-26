import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditDialog from './EditDialog';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as dialogActions from '@/store/dialogSlice';
import * as entryActions from '@/store/entrySlice';

const TEST_FIELD_VALUE = 'Test';
const SUCCESS_TOAST_MESSAGE = 'Запись успешно отредактирована!';
const ERROR_TOAST_MESSAGE = 'Произошла ошибка при редактировании записи!';
const NOT_FOUND_TOAST_MESSAGE = 'Запись не найдена';

const mockEntry = {
  id: '1',
  worst_case: 'Existing worst case',
  worst_consequences: 'Existing consequences',
  what_can_i_do: 'Existing action',
  how_will_i_cope: 'Existing coping',
  created_at: '2024-01-01',
  created_by: 'user1',
};

const updatedEntry = {
  ...mockEntry,
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

describe('EditDialog', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const setupMocks = (isDialogOpen = true, editEntryId = '1', entries = [mockEntry]) => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);

    let callCount = 0;
    mockedSelect.mockImplementation(() => {
      const values = [isDialogOpen, editEntryId, entries];
      const result = values[callCount % 3];
      callCount++;
      return result;
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
      render(<EditDialog />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render modal when isShowDialog is false', () => {
      setupMocks(false);
      render(<EditDialog />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls closeDialog when modal is closed', () => {
      const mockedCloseDialog = vi.spyOn(dialogActions, 'closeDialog');
      render(<EditDialog />);

      fireEvent.click(screen.getByText('Отмена'));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(mockedCloseDialog).toHaveBeenCalledWith('isOpenEditDialog');
    });
  });

  describe('Form behavior', () => {
    it('displays all four form fields with correct labels', () => {
      render(<EditDialog />);

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

    it('populates form fields with existing entry data', async () => {
      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).toHaveValue(mockEntry.worst_case);
        expect(screen.getByTestId('worstConsequences')).toHaveValue(mockEntry.worst_consequences);
        expect(screen.getByTestId('whatCanIDo')).toHaveValue(mockEntry.what_can_i_do);
        expect(screen.getByTestId('howWillICope')).toHaveValue(mockEntry.how_will_i_cope);
      });
    });

    it('disables submit button when form is not dirty', async () => {
      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByText('Сохранить')).toBeDisabled();
      });
    });

    it('enables submit button when form is valid and dirty', async () => {
      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).toHaveValue(mockEntry.worst_case);
      });

      fireEvent.change(screen.getByTestId('worstCase'), {
        target: { value: 'Modified value' },
      });

      await waitFor(() => {
        expect(screen.getByText('Сохранить')).not.toBeDisabled();
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

      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).toHaveValue(mockEntry.worst_case);
      });

      await fillForm();

      await waitFor(() => {
        expect(screen.getByText('Сохранить')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Сохранить'));

      await waitFor(() => {
        expect(screen.getByText('Сохранение...')).toBeInTheDocument();
        expect(screen.getByText('Сохранение...')).toBeDisabled();
      });

      resolvePromise!(updatedEntry);
    });

    it('calls editEntry with correct data on form submission', async () => {
      const mockedEditEntry = vi.spyOn(entryActions, 'editEntry');
      const unwrapMock = vi.fn().mockResolvedValue(updatedEntry);
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).toHaveValue(mockEntry.worst_case);
      });

      await fillForm();

      await waitFor(() => {
        expect(screen.getByText('Сохранить')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Сохранить'));

      await waitFor(() => {
        expect(mockedEditEntry).toHaveBeenCalledTimes(1);
        expect(mockedEditEntry).toHaveBeenCalledWith(updatedEntry);
      });
    });

    it('shows success toast on successful submission', async () => {
      const unwrapMock = vi.fn().mockResolvedValue(updatedEntry);
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).toHaveValue(mockEntry.worst_case);
      });

      await fillForm();

      await waitFor(() => {
        expect(screen.getByText('Сохранить')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Сохранить'));

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

      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).toHaveValue(mockEntry.worst_case);
      });

      await fillForm();

      await waitFor(() => {
        expect(screen.getByText('Сохранить')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Сохранить'));

      await waitFor(() => {
        expect(mockToast.danger).toHaveBeenCalledWith(ERROR_TOAST_MESSAGE);
      });
    });

    it('closes modal after successful submission', async () => {
      const unwrapMock = vi.fn().mockResolvedValue(updatedEntry);
      dispatch.mockReturnValue({
        unwrap: unwrapMock,
      });

      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).toHaveValue(mockEntry.worst_case);
      });

      await fillForm();

      await waitFor(() => {
        expect(screen.getByText('Сохранить')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Сохранить'));

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining('closeDialog'),
          }),
        );
      });
    });

    it('shows error toast and closes dialog when entry is not found', async () => {
      setupMocks(true, undefined, []);

      render(<EditDialog />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await fillForm();

      await waitFor(() => {
        expect(screen.getByText('Сохранить')).not.toBeDisabled();
      });

      fireEvent.click(screen.getByText('Сохранить'));

      await waitFor(() => {
        expect(mockToast.danger).toHaveBeenCalledWith(NOT_FOUND_TOAST_MESSAGE);
      });
    });
  });

  describe('Entry handling', () => {
    it('handles missing entry gracefully', async () => {
      setupMocks(true, '999', [mockEntry]);
      render(<EditDialog />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('worstCase')).toHaveValue('');
        expect(screen.getByTestId('worstConsequences')).toHaveValue('');
        expect(screen.getByTestId('whatCanIDo')).toHaveValue('');
        expect(screen.getByTestId('howWillICope')).toHaveValue('');
      });
    });
  });
});
