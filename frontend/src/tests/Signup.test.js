import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../components/Signup';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserAuthContextProvider } from '../context/UserAuthContext';

jest.mock('../context/UserAuthContext', () => ({
  useUserAuth: () => ({
    signUp: jest.fn().mockResolvedValueOnce()
  })
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('Signup Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders signup form with email, password, and confirm password inputs', () => {
    render(
      <Router>
        <UserAuthContextProvider>
          <Signup />
        </UserAuthContextProvider>
      </Router>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  test('displays error when passwords do not match', async () => {
    render(
      <Router>
        <UserAuthContextProvider>
          <Signup />
        </UserAuthContextProvider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password456' } });

    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('submits form with valid credentials', async () => {
    const signUp = require('../context/UserAuthContext').useUserAuth().signUp;

    render(
      <Router>
        <UserAuthContextProvider>
          <Signup />
        </UserAuthContextProvider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith('testuser@example.com', 'password123');
    });
  });

  test('redirects to home after successful signup', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate
    }));

    render(
      <Router>
        <UserAuthContextProvider>
          <Signup />
        </UserAuthContextProvider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
