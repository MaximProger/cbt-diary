import { render, screen } from '@testing-library/react';
import Layout from './Layout';
import { vi } from 'vitest';
import type { ReactNode } from 'react';

vi.mock('../Container/Container', () => ({
  default: ({ children }: { children: ReactNode }) => <div data-testid="container">{children}</div>,
}));

describe('Layout', () => {
  it('renders children correctly', () => {
    render(
      <Layout>
        <article></article>
      </Layout>,
    );
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renders container component', () => {
    render(
      <Layout>
        <article></article>
      </Layout>,
    );
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });
});
