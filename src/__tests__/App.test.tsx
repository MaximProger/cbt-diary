import App from '@/App';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as entryActions from '@/store/entrySlice';
import { initialState as entryInitialState } from '@/store/entrySlice';
import { initialState as toastInitialState } from '@/store/toastSlice';
import { initialState as themeInitialState } from '@/store/themeSlice';
import { initialState as dialogInitialState } from '@/store/dialogSlice';
import { supabase } from '@/supabaseClient';
import { mockSession, mockToast, mockUser } from '@/__mocks__';
import type { TRootState } from '@/store';
import useThemeInitializer from '@/hooks/useThemeInitializer/useThemeInitializer';

vi.mock('react-redux');

vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
      }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

vi.mock('@/hooks/useThemeInitializer/useThemeInitializer');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');
const mockedSelect = vi.spyOn(reduxHooks, 'useSelector');
const mockState = {
  entries: entryInitialState,
  toasts: toastInitialState,
  theme: themeInitialState,
  dialogs: dialogInitialState,
};
const mockEntry = {
  id: Math.random(),
  created_at: expect.any(String),
  created_by: mockUser.id,
  worst_case: 'Test',
  worst_consequences: 'Test',
  what_can_i_do: 'Test',
  how_will_i_cope: 'Test',
};

describe('App', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  const setupMocks = (mockState: TRootState) => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
    mockedSelect.mockImplementation((selector) => {
      return selector(mockState);
    });
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks(mockState);
  });

  it('renders layout component', () => {
    render(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
  it('shows loader when initial loading is true', () => {
    mockedSelect.mockReturnValue(entryInitialState);
    render(<App />);
    expect(screen.getByTestId('loader_wrapper')).toBeInTheDocument();
  });
  it('renders header component', () => {
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false } });
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
  it('shows panel when user is authenticated', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false } });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('pannel')).toBeInTheDocument());
  });
  it('displays entries list when entries exist and user authenticated', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false, entries: [mockEntry] } });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('entries_list')).toBeInTheDocument());
  });
  it('shows no entries alert when no entries and status fulfilled', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false, status: 'fulfilled' } });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('no_entries_alert')).toBeInTheDocument());
  });
  it('displays error alert when error exists', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false, error: 'Error' } });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('error_alert')).toBeInTheDocument());
  });
  it('renders add dialog when authenticated', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    setupMocks({
      ...mockState,
      entries: { ...entryInitialState, isInitialLoading: false },
      dialogs: { ...dialogInitialState, isOpenAddDialog: true },
    });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('add_dialog_header')).toBeInTheDocument());
  });
  it('renders edit dialog when authenticated', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    setupMocks({
      ...mockState,
      entries: { ...entryInitialState, isInitialLoading: false },
      dialogs: { ...dialogInitialState, isOpenEditDialog: true },
    });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('edit_dialog_header')).toBeInTheDocument());
  });
  it('renders delete dialog when authenticated', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    setupMocks({
      ...mockState,
      entries: { ...entryInitialState, isInitialLoading: false },
      dialogs: { ...dialogInitialState, isOpenDeleteDialog: true },
    });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('delete_dialog_header')).toBeInTheDocument());
  });
  it('shows no entries alert when not authenticated', () => {
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false, status: 'fulfilled' } });
    render(<App />);
    expect(screen.getByTestId('no_entries_alert')).toBeInTheDocument();
  });
  it('renders auth dialog when not authenticated', async () => {
    setupMocks({
      ...mockState,
      entries: { ...entryInitialState, isInitialLoading: false },
      dialogs: { ...dialogInitialState, isOpenAuthDialog: true },
    });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('auth_dialog_header')).toBeInTheDocument());
  });
  it('renders toast container with bounce animation', () => {
    setupMocks({
      ...mockState,
      entries: { ...entryInitialState, isInitialLoading: false },
      toasts: { toasts: [mockToast] },
    });
    render(<App />);
    expect(screen.getByTestId('toast_container')).toBeInTheDocument();
  });
  it('renders info dialog', async () => {
    setupMocks({
      ...mockState,
      entries: { ...entryInitialState, isInitialLoading: false },
      dialogs: { ...dialogInitialState, isOpenInfoDialog: true },
    });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId('info_dialog_header')).toBeInTheDocument());
  });
  it('dispatches fetch entries on mount', () => {
    const mockedFetchEntries = vi.spyOn(entryActions, 'fetchEntries');
    render(<App />);
    expect(mockedFetchEntries).toHaveBeenCalled();
  });
  it('sets session from supabase auth', () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false } });
    render(<App />);
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });
  it('subscribes to auth state changes', () => {
    const mockUnsubscribe = vi.fn();
    const mockSubscription = {
      id: 'some-id',
      callback: vi.fn(),
      unsubscribe: mockUnsubscribe,
    };
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: mockSubscription },
    });
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false } });
    render(<App />);
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(expect.any(Function));
  });
  it('unsubscribes from auth on unmount', () => {
    const mockUnsubscribe = vi.fn();
    const mockSubscription = {
      id: 'some-id',
      callback: vi.fn(),
      unsubscribe: mockUnsubscribe,
    };
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: mockSubscription },
    });
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    setupMocks({ ...mockState, entries: { ...entryInitialState, isInitialLoading: false } });
    const { unmount } = render(<App />);
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    expect(mockUnsubscribe).not.toHaveBeenCalled();
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
  it('calls theme initializer hook', () => {
    render(<App />);
    expect(useThemeInitializer).toHaveBeenCalled();
  });
});
