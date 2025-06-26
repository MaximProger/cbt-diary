import { render, screen } from '@testing-library/react';
import DialogTextarea from './DialogTextarea';
import { vi } from 'vitest';
import type { UseFormRegisterReturn } from 'react-hook-form';

const mockRegisterProps: UseFormRegisterReturn = {
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: 'email',
  required: true,
  pattern: '+/.%1',
};

describe('DialogTextarea', () => {
  it('should render textarea with default props', () => {
    render(<DialogTextarea registerProps={mockRegisterProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should apply custom id when provided', () => {
    render(<DialogTextarea id="email" registerProps={mockRegisterProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email');
  });

  it('should apply register props to textarea', () => {
    render(<DialogTextarea id="email" registerProps={mockRegisterProps} />);
    screen.debug();
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('name', mockRegisterProps.name);
    expect(textarea).toHaveAttribute('required', '');
    expect(textarea).toHaveAttribute('pattern', mockRegisterProps.pattern);
  });

  it('should have 5 rows by default', () => {
    render(<DialogTextarea id="email" registerProps={mockRegisterProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('should have resize-none class applied', () => {
    render(<DialogTextarea id="email" registerProps={mockRegisterProps} />);
    expect(screen.getByRole('textbox')).toHaveClass('resize-none');
  });
});
