import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../components/Home'; 
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Home component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders all proposals initially', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // expect(screen.getByText('AI in Healthcare')).toBeInTheDocument();
    // expect(screen.getByText('Sustainable Energy Research')).toBeInTheDocument();
    // expect(screen.getByText('Blockchain in Education')).toBeInTheDocument();
    // expect(screen.getByText('Climate Change Impact')).toBeInTheDocument();
    // expect(screen.getByText('Genomic Data Privacy')).toBeInTheDocument();
    // expect(screen.getByText('Neurotechnology & Learning')).toBeInTheDocument();
  });

  test('dropdown toggles on filter icon click', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const filterIcon = screen.getByTestId('filter-icon');
    fireEvent.click(filterIcon);

    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Environment')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
  });

  test('filters proposals by category', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('filter-icon'));
    fireEvent.click(screen.getByText('Technology'));

    expect(screen.getByText('Blockchain in Education')).toBeInTheDocument();
    expect(screen.getByText('Neurotechnology & Learning')).toBeInTheDocument();
    expect(screen.queryByText('AI in Healthcare')).not.toBeInTheDocument();
  });

  test('navigates on proposal click', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('AI in Healthcare'));

    expect(mockNavigate).toHaveBeenCalledWith('/proposal/1');
  });
});
