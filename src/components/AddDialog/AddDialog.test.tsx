import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddDialog from './AddDialog';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as dialogActions from '@/store/dialogSlice';
import * as entryActions from '@/store/entrySlice';
import { user } from '@/__mocks__/mockUser';

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isShowDialog is true', () => {
    mockedSelect.mockReturnValue(true);
    render(<AddDialog user={user} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render modal when isShowDialog is false', () => {
    mockedSelect.mockReturnValue(false);
    render(<AddDialog user={user} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls closeDialog when modal is closed', () => {
    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    render(<AddDialog user={user} />);
    const mockedCloseDialog = vi.spyOn(dialogActions, 'closeDialog');
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-btn'));
    expect(dispatch).toHaveBeenCalledTimes(1);
    mockedSelect.mockReturnValue(false);
    expect(mockedCloseDialog).toHaveBeenCalledWith('isOpenAddDialog');
  });

  it('displays all four form fields with correct labels', () => {
    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
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
    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    render(<AddDialog user={user} />);
    expect(screen.getByTestId('submit')).toHaveTextContent('Создать');
    expect(screen.getByTestId('submit')).toBeDisabled();
  });

  it('enables submit button when all required fields are filled', async () => {
    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    render(<AddDialog user={user} />);
    fireEvent.change(screen.getByTestId('worstCase'), {
      target: {
        value: 'Test',
      },
    });
    fireEvent.change(screen.getByTestId('worstConsequences'), {
      target: {
        value: 'Test',
      },
    });
    fireEvent.change(screen.getByTestId('whatCanIDo'), {
      target: {
        value: 'Test',
      },
    });
    fireEvent.change(screen.getByTestId('howWillICope'), {
      target: {
        value: 'Test',
      },
    });
    expect(screen.getByTestId('submit')).toHaveTextContent('Создать');
    await waitFor(() => {
      expect(screen.getByTestId('submit')).not.toBeDisabled();
    });
  });

  it('shows loading state when submitting form', async () => {
    const field = 'Test';
    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    const unwrapMock = vi.fn().mockImplementation(() => new Promise(() => {}));
    dispatch.mockReturnValue({
      unwrap: unwrapMock,
    });

    render(<AddDialog user={user} />);

    fireEvent.change(screen.getByTestId('worstCase'), { target: { value: field } });
    fireEvent.change(screen.getByTestId('worstConsequences'), { target: { value: field } });
    fireEvent.change(screen.getByTestId('whatCanIDo'), { target: { value: field } });
    fireEvent.change(screen.getByTestId('howWillICope'), { target: { value: field } });

    await waitFor(() => {
      expect(screen.getByTestId('submit')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(screen.getByTestId('submit')).toHaveTextContent('Создание...');
      expect(screen.getByTestId('submit')).toBeDisabled();
    });
  });

  it('calls createEntry with correct data on form submission', async () => {
    const field = 'Test';
    const entry = {
      created_at: expect.any(String),
      created_by: user.id,
      worst_case: field,
      worst_consequences: field,
      what_can_i_do: field,
      how_will_i_cope: field,
    };
    const mockedCreateEntry = vi.spyOn(entryActions, 'createEntry');

    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    const unwrapMock = vi.fn().mockResolvedValue(entry);
    dispatch.mockReturnValue({
      unwrap: unwrapMock,
    });

    render(<AddDialog user={user} />);
    fireEvent.change(screen.getByTestId('worstCase'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('worstConsequences'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('whatCanIDo'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('howWillICope'), {
      target: {
        value: field,
      },
    });

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
    const field = 'Test';
    const entry = {
      created_at: expect.any(String),
      created_by: user.id,
      worst_case: field,
      worst_consequences: field,
      what_can_i_do: field,
      how_will_i_cope: field,
    };

    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    const unwrapMock = vi.fn().mockResolvedValue(entry);
    dispatch.mockReturnValue({
      unwrap: unwrapMock,
    });

    render(<AddDialog user={user} />);
    fireEvent.change(screen.getByTestId('worstCase'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('worstConsequences'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('whatCanIDo'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('howWillICope'), {
      target: {
        value: field,
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('submit')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('submit'));
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Запись успешно добавлена!');
    });
  });

  it('shows error toast on failed submission', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const field = 'Test';
    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    const unwrapMock = vi.fn().mockRejectedValue(new Error('Submission failed'));
    dispatch.mockReturnValue({
      unwrap: unwrapMock,
    });

    render(<AddDialog user={user} />);
    fireEvent.change(screen.getByTestId('worstCase'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('worstConsequences'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('whatCanIDo'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('howWillICope'), {
      target: {
        value: field,
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('submit')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('submit'));
    await waitFor(() => {
      expect(mockToast.danger).toHaveBeenCalledWith('Произошла ошибка при добавлении записи!');
    });
  });

  it('resets form after successful submission', async () => {
    const field = 'Test';
    const entry = {
      created_at: expect.any(String),
      created_by: user.id,
      worst_case: field,
      worst_consequences: field,
      what_can_i_do: field,
      how_will_i_cope: field,
    };

    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    const unwrapMock = vi.fn().mockResolvedValue(entry);
    dispatch.mockReturnValue({
      unwrap: unwrapMock,
    });

    render(<AddDialog user={user} />);
    fireEvent.change(screen.getByTestId('worstCase'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('worstConsequences'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('whatCanIDo'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('howWillICope'), {
      target: {
        value: field,
      },
    });

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
    const field = 'Test';
    const entry = {
      created_at: expect.any(String),
      created_by: user.id,
      worst_case: field,
      worst_consequences: field,
      what_can_i_do: field,
      how_will_i_cope: field,
    };

    const dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockReturnValue(true);
    const unwrapMock = vi.fn().mockResolvedValue(entry);
    dispatch.mockReturnValue({
      unwrap: unwrapMock,
    });

    render(<AddDialog user={user} />);
    fireEvent.change(screen.getByTestId('worstCase'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('worstConsequences'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('whatCanIDo'), {
      target: {
        value: field,
      },
    });
    fireEvent.change(screen.getByTestId('howWillICope'), {
      target: {
        value: field,
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('submit')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId('submit'));
    mockedSelect.mockReturnValue(false);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
