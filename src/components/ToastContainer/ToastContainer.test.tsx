import { render, screen } from '@testing-library/react';
import * as reduxHooks from 'react-redux';
import { vi } from 'vitest';
import ToastContainer from './ToastContainer';
import { mockToast } from '@/__mocks__';

vi.mock('react-redux');

const mockedSelect = vi.spyOn(reduxHooks, 'useSelector');

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when toasts array is empty', () => {
    mockedSelect.mockReturnValue([]);
    render(<ToastContainer />);
    expect(screen.queryByTestId('container')).not.toBeInTheDocument();
  });
  it('displays toast items when toasts exist in state', () => {
    mockedSelect.mockReturnValue([mockToast]);
    render(<ToastContainer />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('item')).toBeInTheDocument();
  });
  it('applies correct positioning classes for each position prop', () => {
    mockedSelect.mockReturnValue([mockToast]);
    const { rerender } = render(<ToastContainer />);
    expect(screen.getByTestId('container')).toHaveClass('top-4 right-4');
    rerender(<ToastContainer position="top-left" />);
    expect(screen.getByTestId('container')).toHaveClass('top-4 left-4');
    rerender(<ToastContainer position="top-center" />);
    expect(screen.getByTestId('container')).toHaveClass('top-4 left-1/2 transform -translate-x-1/2');
    rerender(<ToastContainer position="bottom-right" />);
    expect(screen.getByTestId('container')).toHaveClass('bottom-4 right-4');
    rerender(<ToastContainer position="bottom-left" />);
    expect(screen.getByTestId('container')).toHaveClass('bottom-4 left-4');
  });
  it('uses correct flex direction for bottom positions (flex-col-reverse)', () => {
    mockedSelect.mockReturnValue([mockToast]);
    const { rerender } = render(<ToastContainer />);
    expect(screen.getByTestId('container')).not.toHaveClass('flex-col-reverse');
    rerender(<ToastContainer position="bottom-left" />);
    expect(screen.getByTestId('container')).toHaveClass('flex-col-reverse');
  });
  it('uses correct flex direction for top positions (flex-col)', () => {
    mockedSelect.mockReturnValue([mockToast]);
    const { rerender } = render(<ToastContainer />);
    expect(screen.getByTestId('container')).toHaveClass('flex-col');
    rerender(<ToastContainer position="bottom-left" />);
    expect(screen.getByTestId('container')).not.toHaveClass('flex-col');
  });
  it('limits visible toasts to maxtoasts prop value', () => {
    mockedSelect.mockReturnValue([mockToast, mockToast, mockToast]);
    render(<ToastContainer maxToasts={2} />);
    expect(screen.getAllByTestId('item')).toHaveLength(2);
  });
  it('passes correct props to toastitem component', () => {
    mockedSelect.mockReturnValue([mockToast]);
    render(<ToastContainer />);
    expect(screen.getByTestId('item')).toHaveTextContent(mockToast.message);
  });
  it('applies pointer-events-none to container and pointer-events-auto to items', () => {
    mockedSelect.mockReturnValue([mockToast]);
    render(<ToastContainer />);
    expect(screen.getByTestId('container')).toHaveClass('pointer-events-none');
    expect(screen.getByTestId('item')).toHaveClass('pointer-events-auto');
  });
  it('shows most recent toasts when exceeding maxtoasts limit', () => {
    const mockToasts = [
      { ...mockToast, id: '1', message: 'First' },
      { ...mockToast, id: '2', message: 'Second' },
      { ...mockToast, id: '3', message: 'Third' },
    ];
    mockedSelect.mockReturnValue(mockToasts);
    render(<ToastContainer maxToasts={2} />);

    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });
  it('applies animation delay based on toast index', () => {
    const mockToasts = [
      { ...mockToast, id: '1' },
      { ...mockToast, id: '2' },
    ];
    mockedSelect.mockReturnValue(mockToasts);
    render(<ToastContainer />);

    const items = screen.getAllByTestId('item');
    expect(items[0]).toHaveStyle('animation-delay: 0ms');
    expect(items[1]).toHaveStyle('animation-delay: 100ms');
  });
});
