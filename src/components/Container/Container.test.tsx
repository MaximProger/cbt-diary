import { render, screen } from '@testing-library/react';
import Container from './Container';

describe('Container', () => {
  it('renders correctly', () => {
    render(
      <Container>
        <article></article>
      </Container>,
    );

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('container')).toHaveClass('container');
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
