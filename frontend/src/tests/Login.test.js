import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserAuthContextProvider } from '../context/UserAuthContext';

jest.mock('../context/UserAuthContext', () => ({
  useUserAuth: () => ({
    logIn: jest.fn().mockResolvedValueOnce(),
    googleSignIn: jest.fn().mockResolvedValueOnce({ user: { email: 'testuser@example.com' } })
  })
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('Login Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders login form with email and password inputs', () => {
    render(
      <Router>
        <UserAuthContextProvider>
          <Login />
        </UserAuthContextProvider>
      </Router>
    );

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('submits form with correct credentials', async () => {
    const logIn = require('../context/UserAuthContext').useUserAuth().logIn;

    render(
      <Router>
        <UserAuthContextProvider>
          <Login />
        </UserAuthContextProvider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Log In'));

    await screen.findByText('Log In'); 

    expect(logIn).toHaveBeenCalledWith('testuser@example.com', 'password');
  });
});
