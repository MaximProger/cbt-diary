import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    render(<Loader />);
    expect(screen.getByTestId('loader_wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('applies wrapper className correctly', () => {
    render(<Loader wrapperClassName="custom-wrapper" />);
    expect(screen.getByTestId('loader_wrapper')).toHaveClass('custom-wrapper');
  });

  it('applies spinner className correctly', () => {
    render(<Loader className="custom-spinner" />);
    const spinnerContainer = screen.getByTestId('loader');
    const spinnerElement =
      spinnerContainer.querySelector('.custom-spinner') || spinnerContainer.querySelector('[class*="custom-spinner"]');

    expect(spinnerElement).toBeInTheDocument();
  });

  it('renders with correct aria-label', () => {
    render(<Loader />);
    expect(screen.getByLabelText('Идёт загрузка...')).toBeInTheDocument();
  });

  it('renders without classNames when none provided', () => {
    render(<Loader />);
    const wrapper = screen.getByTestId('loader_wrapper');
    const spinner = screen.getByTestId('loader');

    expect(wrapper).not.toHaveClass();
    expect(spinner).toBeInTheDocument();
  });

  it('applies both classNames simultaneously', () => {
    render(<Loader wrapperClassName="wrapper-class" className="spinner-class" />);
    expect(screen.getByTestId('loader_wrapper')).toHaveClass('wrapper-class');
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Loader />);
    const spinner = screen.getByRole('status', { name: 'Идёт загрузка...' });
    expect(spinner).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Loader className="test-class" wrapperClassName="test-wrapper" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
