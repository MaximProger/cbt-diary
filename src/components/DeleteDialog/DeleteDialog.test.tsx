import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteDialog from './DeleteDialog';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as dialogActions from '@/store/dialogSlice';
import * as entryActions from '@/store/entrySlice';

const TEST_ENTRY_ID = 'test-entry-id';
const SUCCESS_TOAST_MESSAGE = 'Запись успешно удалена!';
const ERROR_TOAST_MESSAGE = 'Произошла ошибка при удалении записи!';

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

describe('DeleteDialog', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const setupMocks = (isDialogOpen = true, deleteEntryId = TEST_ENTRY_ID) => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockImplementation((selector) => {
      const state = {
        dialogs: { isOpenDeleteDialog: isDialogOpen },
        entries: { deleteEntryId },
      };
      return selector(state);
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
      render(<DeleteDialog />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render modal when isShowDialog is false', () => {
      setupMocks(false);
      render(<DeleteDialog />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('displays confirmation message and buttons', () => {
      render(<DeleteDialog />);
      expect(screen.getByText('Вы уверены, что хотите удалить эту запись?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Да, я уверен' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Нет, отменить' })).toBeInTheDocument();
    });

    it('closes dialog when cancel button is clicked', () => {
      const mockedCloseDialog = vi.spyOn(dialogActions, 'closeDialog');
      const mockedClearDeleteEntryId = vi.spyOn(entryActions, 'clearDeleteEntryId');

      render(<DeleteDialog />);
      fireEvent.click(screen.getByRole('button', { name: 'Нет, отменить' }));

      expect(mockedCloseDialog).toHaveBeenCalledWith('isOpenDeleteDialog');
      expect(mockedClearDeleteEntryId).toHaveBeenCalled();
    });
  });

  describe('Delete functionality', () => {
    it('calls deleteEntry with correct ID on confirmation', async () => {
      const mockedDeleteEntry = vi.spyOn(entryActions, 'deleteEntry');
      const unwrapMock = vi.fn().mockResolvedValue({});
      dispatch.mockReturnValue({ unwrap: unwrapMock });

      render(<DeleteDialog />);
      fireEvent.click(screen.getByRole('button', { name: 'Да, я уверен' }));

      await waitFor(() => {
        expect(mockedDeleteEntry).toHaveBeenCalledWith(TEST_ENTRY_ID);
      });
    });

    it('shows success toast and closes dialog on successful deletion', async () => {
      const mockedCloseDialog = vi.spyOn(dialogActions, 'closeDialog');
      const unwrapMock = vi.fn().mockResolvedValue({});
      dispatch.mockReturnValue({ unwrap: unwrapMock });

      render(<DeleteDialog />);
      fireEvent.click(screen.getByRole('button', { name: 'Да, я уверен' }));

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(SUCCESS_TOAST_MESSAGE);
        expect(mockedCloseDialog).toHaveBeenCalledWith('isOpenDeleteDialog');
      });
    });

    it('shows error toast on failed deletion', async () => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const unwrapMock = vi.fn().mockRejectedValue(new Error('Delete failed'));
      dispatch.mockReturnValue({ unwrap: unwrapMock });

      render(<DeleteDialog />);
      fireEvent.click(screen.getByRole('button', { name: 'Да, я уверен' }));

      await waitFor(() => {
        expect(mockToast.danger).toHaveBeenCalledWith(ERROR_TOAST_MESSAGE);
      });
    });

    it('does not call deleteEntry when deleteEntryId is null', async () => {
      setupMocks(true, '');
      const mockedDeleteEntry = vi.spyOn(entryActions, 'deleteEntry');

      render(<DeleteDialog />);
      fireEvent.click(screen.getByRole('button', { name: 'Да, я уверен' }));

      await waitFor(() => {
        expect(mockedDeleteEntry).not.toHaveBeenCalled();
      });
    });
  });
});
