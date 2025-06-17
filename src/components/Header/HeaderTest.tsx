import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  it('render the header with logo', () => {
    render(<Header session={null} />);
    expect(screen.getByText('Дневник катастрофизации')).toBeInTheDocument();
  });
});
