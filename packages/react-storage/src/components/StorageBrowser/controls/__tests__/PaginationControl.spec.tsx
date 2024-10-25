import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaginationControl } from '../PaginationControl';
import { usePagination } from '../hooks/usePagination';
import { useResolvedComposable } from '../hooks/useResolvedComposable';

jest.mock('../hooks/usePagination');
jest.mock('../hooks/useResolvedComposable');

describe('PaginationControl', () => {
  // assert mocks
  const mockUsePagination = usePagination as jest.Mock;
  const mockUseResolvedComposable = useResolvedComposable as jest.Mock;

  beforeAll(() => {
    mockUseResolvedComposable.mockImplementation(
      (component: React.JSX.Element) => component
    );
  });

  afterEach(() => {
    mockUsePagination.mockReset();
    mockUseResolvedComposable.mockReset();
  });

  it('renders the PaginationControl', async () => {
    mockUsePagination.mockReturnValue({
      currentPage: 1,
      disableNext: false,
      disablePrevious: false,
      handlePaginateNext: jest.fn(),
      handlePaginatePrevious: jest.fn(),
    });

    render(<PaginationControl />);

    const nav = screen.getByRole('navigation');
    const list = screen.getByRole('list');
    const listItems = await screen.findAllByRole('listitem');
    const nextButton = screen.getByRole('button', { name: 'Go to next page' });
    const prevButton = screen.getByRole('button', {
      name: 'Go to previous page',
    });
    const nextIcon = nextButton.querySelector('svg');
    const prevIcon = nextButton.querySelector('svg');

    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
    expect(nextIcon).toBeInTheDocument();
    expect(prevIcon).toBeInTheDocument();
    expect(nextIcon).toHaveAttribute('aria-hidden', 'true');
    expect(prevIcon).toHaveAttribute('aria-hidden', 'true');
    expect(nav).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(listItems).toHaveLength(3);
  });
});
