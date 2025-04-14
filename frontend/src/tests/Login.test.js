import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import React from 'react';


// Mock the useUserAuth context
jest.mock('../context/UserAuthContext', () => ({
  useUserAuth: jest.fn(),
}));

const mockLogIn = jest.fn();
const mockGoogleSignIn = jest.fn();

beforeEach(() => {
  useUserAuth.mockReturnValue({
    logIn: mockLogIn,
    googleSignIn: mockGoogleSignIn,
  });
});

describe('Login Component', () => {
  test('renders the login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('displays error message when login fails', async () => {
    mockLogIn.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('navigates to home page when login is successful', async () => {
    mockLogIn.mockResolvedValueOnce();

    const navigate = jest.fn();

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/home');
    });
  });

  test('handles Google sign-in', async () => {
    mockGoogleSignIn.mockResolvedValueOnce({ user: { email: 'user@example.com' } });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(mockGoogleSignIn).toHaveBeenCalled();
      expect(screen.getByPlaceholderText('Email address').value).toBe('user@example.com');
    });
  });

  test('displays error when Google sign-in fails', async () => {
    mockGoogleSignIn.mockRejectedValueOnce(new Error('Google sign-in failed'));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(mockGoogleSignIn).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Google sign-in failed');
    });
  });
});
