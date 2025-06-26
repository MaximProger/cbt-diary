import { fireEvent, render, screen } from '@testing-library/react';
import EntryItem from './EntryItem';
import type { IEntry } from '@/types';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as entryActions from '@/store/entrySlice';
import * as dialogActions from '@/store/dialogSlice';

const mockEntry: IEntry = {
  id: 1,
  worst_case: 'Existing worst case',
  worst_consequences: 'Existing consequences',
  what_can_i_do: 'Existing action',
  how_will_i_cope: 'Existing coping',
  created_at: '2025-06-06T10:11:52.37+00:00',
  created_by: 'user1',
};

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');

describe('EntryItem', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  const setupMocks = () => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('displaying the formatted creation date of the record', () => {
    render(<EntryItem entry={mockEntry} />);
    expect(screen.getByRole('time')).toHaveTextContent('6 июня 2025, 13:11');
  });

  it('displaying the contents of the worst_case field', () => {
    render(<EntryItem entry={mockEntry} />);
    expect(screen.getByTestId('worst_case_field')).toHaveTextContent(mockEntry.worst_case);
  });

  it('displaying the contents of the worst_consequences field', () => {
    render(<EntryItem entry={mockEntry} />);
    expect(screen.getByTestId('worst_consequences_field')).toHaveTextContent(mockEntry.worst_consequences);
  });

  it('displaying the contents of the what_can_i_do field', () => {
    render(<EntryItem entry={mockEntry} />);
    expect(screen.getByTestId('what_can_i_do_field')).toHaveTextContent(mockEntry.what_can_i_do);
  });

  it('displaying the contents of the how_will_i_cope field', () => {
    render(<EntryItem entry={mockEntry} />);
    expect(screen.getByTestId('how_will_i_cope_field')).toHaveTextContent(mockEntry.how_will_i_cope);
  });

  it('call dispatch with setEditEntryId and openDialog when clicking on the edit button', () => {
    const mockedSetEditEntryId = vi.spyOn(entryActions, 'setEditEntryId');
    const mockedOpenDialog = vi.spyOn(dialogActions, 'openDialog');
    render(<EntryItem entry={mockEntry} />);
    fireEvent.click(screen.getByText('Изменить'));
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mockedSetEditEntryId).toHaveBeenCalledTimes(1);
    expect(mockedSetEditEntryId).toHaveBeenCalledWith(mockEntry.id);
    expect(mockedOpenDialog).toHaveBeenCalledTimes(1);
    expect(mockedOpenDialog).toHaveBeenCalledWith('isOpenEditDialog');
  });

  it('call dispatch with setDeleteEntryId and openDialog when clicking on the delete button', () => {
    const mockedSetDeleteEntryId = vi.spyOn(entryActions, 'setDeleteEntryId');
    const mockedOpenDialog = vi.spyOn(dialogActions, 'openDialog');
    render(<EntryItem entry={mockEntry} />);
    fireEvent.click(screen.getByText('Удалить'));
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mockedSetDeleteEntryId).toHaveBeenCalledTimes(1);
    expect(mockedSetDeleteEntryId).toHaveBeenCalledWith(mockEntry.id);
    expect(mockedOpenDialog).toHaveBeenCalledTimes(1);
    expect(mockedOpenDialog).toHaveBeenCalledWith('isOpenDeleteDialog');
  });

  it('display of edit and delete icons', () => {
    render(<EntryItem entry={mockEntry} />);
    expect(screen.getByText('Изменить')).toBeInTheDocument();
    expect(screen.getByText('Удалить')).toBeInTheDocument();
  });
});
