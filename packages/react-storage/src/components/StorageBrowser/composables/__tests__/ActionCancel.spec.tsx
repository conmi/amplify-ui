import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActionCancel } from '../ActionCancel';
import { CLASS_BASE } from '../../views/constants';

describe('ActionCancel', () => {
  it('renders a button element', () => {
    render(<ActionCancel />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('renders a button with the expected className and label', () => {
    render(<ActionCancel label="Cancel" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(`${CLASS_BASE}__action-cancel`);
    expect(button).toHaveTextContent('Cancel');
  });

  it('renders a button with the expected disabled state', () => {
    render(<ActionCancel isDisabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
