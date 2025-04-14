import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../components/Home';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React from 'react';


// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Home Component', () => {
  let navigate;

  beforeEach(() => {
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  test('renders the dashboard banner and filter icon', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /ai in healthcare/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });

  test('filters proposals by category', async () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    // Initially, all proposals should be shown
    expect(screen.getByText('AI in Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Sustainable Energy Research')).toBeInTheDocument();
    expect(screen.getByText('Blockchain in Education')).toBeInTheDocument();

    // Click the filter icon to show the dropdown
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));

    // Select "Technology" from the dropdown
    fireEvent.click(screen.getByText('Technology'));

    // Now, only "Blockchain in Education" and "Neurotechnology & Learning" should be visible
    expect(screen.queryByText('AI in Healthcare')).not.toBeInTheDocument();
    expect(screen.queryByText('Sustainable Energy Research')).not.toBeInTheDocument();
    expect(screen.queryByText('Blockchain in Education')).toBeInTheDocument();
    expect(screen.queryByText('Neurotechnology & Learning')).toBeInTheDocument();
  });

  test('filters proposals by "All" category', async () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    // Click the filter icon to show the dropdown
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));

    // Select "All" from the dropdown
    fireEvent.click(screen.getByText('All'));

    // All proposals should be visible again
    expect(screen.getByText('AI in Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Sustainable Energy Research')).toBeInTheDocument();
    expect(screen.getByText('Blockchain in Education')).toBeInTheDocument();
  });

  test('navigates to proposal details page when a proposal card is clicked', async () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    // Find and click the "AI in Healthcare" proposal card
    fireEvent.click(screen.getByText('AI in Healthcare'));

    // Ensure navigate is called with the correct URL
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/proposal/1');
    });
  });

  test('toggles the filter dropdown on filter icon click', async () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    const filterIcon = screen.getByRole('button', { name: /filter/i });

    // Initially, dropdown should not be visible
    expect(screen.queryByText('All')).not.toBeInTheDocument();

    // Click the filter icon to toggle the dropdown
    fireEvent.click(filterIcon);
    expect(screen.getByText('All')).toBeInTheDocument();

    // Click the filter icon again to hide the dropdown
    fireEvent.click(filterIcon);
    expect(screen.queryByText('All')).not.toBeInTheDocument();
  });
});
