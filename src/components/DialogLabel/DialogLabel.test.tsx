import { render, screen } from '@testing-library/react';
import DialogLabel from './DialogLabel';

describe('DialogLabel', () => {
  it('renders children correctly', () => {
    render(<DialogLabel>Dialog Label</DialogLabel>);
    expect(screen.getByText('Dialog Label')).toBeInTheDocument();
  });

  it('renders with htmlfor attribute when id provided', () => {
    render(<DialogLabel htmlFor="email">Dialog Label</DialogLabel>);
    expect(screen.getByTestId('flowbite-label')).toHaveAttribute('for', 'email');
  });

  it('renders without htmlfor attribute when id not provided', () => {
    render(<DialogLabel>Dialog Label</DialogLabel>);
    expect(screen.getByTestId('flowbite-label')).not.toHaveAttribute('for');
  });
});
