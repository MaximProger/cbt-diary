import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Pannel from './Pannel';
import * as reduxHooks from 'react-redux';
import * as dialogActions from '@/store/dialogSlice';
import * as entryActions from '@/store/entrySlice';

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');
const mockedFetchEntries = vi.spyOn(entryActions, 'fetchEntries');

describe('Pannel', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  const setupMocks = () => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('renders search input with correct placeholder', () => {
    render(<Pannel />);
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Поиск по записям...');
  });

  it('renders sort select with correct options', () => {
    render(<Pannel />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Сначала новые');
    expect(options[1]).toHaveTextContent('Сначала старые');
  });

  it('renders add entry button', () => {
    render(<Pannel />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Добавить запись');
  });

  it('dispatches openDialog when add button is clicked', () => {
    const mockedOpenDialog = vi.spyOn(dialogActions, 'openDialog');
    render(<Pannel />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockedOpenDialog).toHaveBeenCalled();
    expect(mockedOpenDialog).toHaveBeenCalledWith('isOpenAddDialog');
  });

  it('dispatches setSearchTerm and fetchEntries when search input changes (debounced)', async () => {
    const searchValue = 'test';
    const mockedSetSearchTerm = vi.spyOn(entryActions, 'setSearchTerm');
    render(<Pannel />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: searchValue } });
    await waitFor(
      () => {
        expect(mockedSetSearchTerm).toHaveBeenCalled();
        expect(mockedSetSearchTerm).toHaveBeenCalledWith(searchValue);
        expect(mockedFetchEntries).toHaveBeenCalled();
      },
      { timeout: 1500 },
    );
  });

  it('dispatches setAscending and fetchEntries when sort option changes', async () => {
    const sortValue = 'old';
    const mockedSetAscending = vi.spyOn(entryActions, 'setAscending');
    render(<Pannel />);
    fireEvent.change(screen.getByTestId('select'), { target: { value: sortValue } });
    await waitFor(() => {
      expect(mockedSetAscending).toHaveBeenCalled();
      expect(mockedSetAscending).toHaveBeenCalledWith(sortValue);
      expect(mockedFetchEntries).toHaveBeenCalled();
    });
  });

  it('does not trigger search for empty or whitespace-only input', async () => {
    render(<Pannel />);
    const mockedSetSearchTerm = vi.spyOn(entryActions, 'setSearchTerm');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
    await waitFor(
      () => {
        expect(mockedSetSearchTerm).not.toHaveBeenCalled();
        expect(mockedFetchEntries).not.toHaveBeenCalled();
      },
      { timeout: 1500 },
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } });
    await waitFor(
      () => {
        expect(mockedSetSearchTerm).not.toHaveBeenCalled();
        expect(mockedFetchEntries).not.toHaveBeenCalled();
      },
      { timeout: 1500 },
    );
  });
});
