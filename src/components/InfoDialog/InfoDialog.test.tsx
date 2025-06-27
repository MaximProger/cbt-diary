import { render, screen, fireEvent } from '@testing-library/react';
import InfoDialog from './InfoDialog';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as dialogActions from '@/store/dialogSlice';

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');
const mockedSelect = vi.spyOn(reduxHooks, 'useSelector');

describe('InfoDialog', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  const setupMocks = (isDialogOpen = true) => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(isDialogOpen);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  describe('Modal behavior', () => {
    it('renders modal when isOpenInfoDialog is true', () => {
      render(<InfoDialog />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render modal when isOpenInfoDialog is false', () => {
      setupMocks(false);
      render(<InfoDialog />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls closeDialog when modal is closed', () => {
      const mockedCloseDialog = vi.spyOn(dialogActions, 'closeDialog');
      render(<InfoDialog />);

      fireEvent.click(screen.getByText('Понятно'));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(mockedCloseDialog).toHaveBeenCalledWith('isOpenInfoDialog');
    });
  });

  describe('Content', () => {
    it('displays correct header and content', () => {
      render(<InfoDialog />);

      expect(screen.getByText('Дневник катастрофизации')).toBeInTheDocument();
      expect(
        screen.getByText(/Этот дневник помогает замечать и осознавать склонность к катастрофическому мышлению/),
      ).toBeInTheDocument();
      expect(screen.getByText('Понятно')).toBeInTheDocument();
    });
  });
});
