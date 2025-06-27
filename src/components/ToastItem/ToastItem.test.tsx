import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ToastItem from './ToastItem';
import { mockToast } from '@/__mocks__';
import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as toastActions from '@/store/toastSlice';

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');

describe('ToastItem', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  const setupMocks = () => {
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('renders toast with correct message', () => {
    render(<ToastItem toast={mockToast} />);
    expect(screen.getByRole('alert')).toHaveTextContent(mockToast.message);
  });
  it('displays correct icon for each toast type (success, info, warning, danger)', () => {
    const { rerender } = render(<ToastItem toast={mockToast} />);
    expect(screen.getByTestId('success_icon')).toBeInTheDocument();
    rerender(<ToastItem toast={{ ...mockToast, type: 'info' }} />);
    expect(screen.getByTestId('info_icon')).toBeInTheDocument();
    rerender(<ToastItem toast={{ ...mockToast, type: 'warning' }} />);
    expect(screen.getByTestId('warning_icon')).toBeInTheDocument();
    rerender(<ToastItem toast={{ ...mockToast, type: 'danger' }} />);
    expect(screen.getByTestId('danger_icon')).toBeInTheDocument();
  });
  it('applies correct animation class based on animation prop', () => {
    const { rerender } = render(<ToastItem toast={mockToast} />);
    expect(screen.getByTestId('toast_container')).toHaveClass('toast-enter');
    rerender(<ToastItem toast={mockToast} animation="bounce" />);
    expect(screen.getByTestId('toast_container')).toHaveClass('toast-bounce-enter');
    rerender(<ToastItem toast={mockToast} animation="fade" />);
    expect(screen.getByTestId('toast_container')).toHaveClass('toast-fade-enter');
  });
  it('calls dispatch to remove toast when close button is clicked', async () => {
    const mockedRemoveToast = vi.spyOn(toastActions, 'removeToast');
    render(<ToastItem toast={mockToast} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(
      () => {
        expect(mockedRemoveToast).toHaveBeenCalled();
        expect(mockedRemoveToast).toHaveBeenCalledWith(mockToast.id);
      },
      { timeout: 400 },
    );
  });
  it('auto-closes toast after duration expires', async () => {
    const mockedRemoveToast = vi.spyOn(toastActions, 'removeToast');
    render(<ToastItem toast={mockToast} />);
    const timeout = mockToast.duration ? mockToast.duration + 1000 : 10000;
    await waitFor(
      () => {
        expect(mockedRemoveToast).toHaveBeenCalled();
        expect(mockedRemoveToast).toHaveBeenCalledWith(mockToast.id);
      },
      { timeout },
    );
  });
  it('shows progress bar when duration is set', () => {
    render(<ToastItem toast={mockToast} />);
    expect(screen.getByTestId('progress_bar')).toBeInTheDocument();
  });
  it('hides progress bar on mouse enter', () => {
    render(<ToastItem toast={mockToast} />);
    expect(screen.getByTestId('progress_bar')).toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByTestId('toast_container'));
    expect(screen.queryByTestId('progress_bar')).not.toBeInTheDocument();
  });
  it('shows progress bar on mouse leave', () => {
    render(<ToastItem toast={mockToast} />);
    const container = screen.getByTestId('toast_container');
    fireEvent.mouseEnter(container);
    expect(screen.queryByTestId('progress_bar')).not.toBeInTheDocument();
    fireEvent.mouseLeave(container);
    expect(screen.getByTestId('progress_bar')).toBeInTheDocument();
  });
  it('applies exit animation when closing', () => {
    const { rerender } = render(<ToastItem toast={mockToast} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('toast_container')).toHaveClass('toast-exit');
    rerender(<ToastItem toast={mockToast} animation="fade" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('toast_container')).toHaveClass('toast-fade-exit');
  });
  it('delays toast removal until animation completes', async () => {
    const mockedRemoveToast = vi.spyOn(toastActions, 'removeToast');
    render(<ToastItem toast={mockToast} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockedRemoveToast).not.toHaveBeenCalled();
    expect(screen.getByTestId('toast_container')).toHaveClass('toast-exit');
    await waitFor(
      () => {
        expect(mockedRemoveToast).toHaveBeenCalledWith(mockToast.id);
      },
      { timeout: 400 },
    );
  });
  it('does not auto-close when duration is 0 or undefined', async () => {
    const mockedRemoveToast = vi.spyOn(toastActions, 'removeToast');
    const mockToastWith0Duration = { ...mockToast, duration: 0 };
    render(<ToastItem toast={mockToastWith0Duration} />);
    await waitFor(
      () => {
        expect(mockedRemoveToast).not.toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });
  it('hides progress bar when toast is exiting', () => {
    render(<ToastItem toast={mockToast} />);
    expect(screen.getByTestId('progress_bar')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByTestId('progress_bar')).not.toBeInTheDocument();
  });
  it('applies correct progress bar color based on toast type', () => {
    const { rerender } = render(<ToastItem toast={mockToast} />);
    expect(screen.getByTestId('progress_bar')).toHaveStyle({ 'background-color': '#10b981' });
    rerender(<ToastItem toast={{ ...mockToast, type: 'danger' }} />);
    expect(screen.getByTestId('progress_bar')).toHaveStyle({ 'background-color': '#ef4444' });
    rerender(<ToastItem toast={{ ...mockToast, type: 'warning' }} />);
    expect(screen.getByTestId('progress_bar')).toHaveStyle({ 'background-color': '#f59e0b' });
    rerender(<ToastItem toast={{ ...mockToast, type: 'info' }} />);
    expect(screen.getByTestId('progress_bar')).toHaveStyle({ 'background-color': '#3b82f6' });
  });
});
