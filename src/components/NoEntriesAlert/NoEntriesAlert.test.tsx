import { fireEvent, render, screen } from '@testing-library/react';
import NoEntriesAlert from './NoEntriesAlert';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as dialogActions from '@/store/dialogSlice';
import { mockSession } from '@/__mocks__';

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');

describe('NoEntriesAlert', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  const setupMocks = () => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('renders alert with correct text and icon', () => {
    render(<NoEntriesAlert session={null} />);
    expect(screen.getByText('Пока нет записей')).toBeInTheDocument();
    expect(screen.getByText(/Начните вести дневник катастрофизации/)).toBeInTheDocument();
    expect(screen.getByTestId('flowbite-alert-icon')).toBeInTheDocument();
  });

  it('renders add entry button with correct text and icon', () => {
    render(<NoEntriesAlert session={null} />);
    expect(screen.getByRole('button')).toHaveTextContent('Добавить запись');
    expect(screen.getByTestId('add_icon')).toBeInTheDocument();
  });

  it('dispatches openDialog with "isOpenAuthDialog" when session is null', () => {
    const mockedOpenDialog = vi.spyOn(dialogActions, 'openDialog');
    render(<NoEntriesAlert session={null} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockedOpenDialog).toHaveBeenCalled();
    expect(mockedOpenDialog).toHaveBeenCalledWith('isOpenAuthDialog');
  });

  it('dispatches openDialog with "isOpenAddDialog" when session exists', () => {
    const mockedOpenDialog = vi.spyOn(dialogActions, 'openDialog');
    render(<NoEntriesAlert session={mockSession} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockedOpenDialog).toHaveBeenCalled();
    expect(mockedOpenDialog).toHaveBeenCalledWith('isOpenAddDialog');
  });
});
