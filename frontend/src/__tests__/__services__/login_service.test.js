import { login_service, get_Users } from '../../services/login_service'; 


import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
  fetchMock.enableMocks(); 
});

afterEach(() => {
  fetchMock.resetMocks(); 
});

describe('login_service', () => {
  it('should successfully login and return user data', async () => {
    const mockResponse = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await login_service('John Doe', 'john.doe@example.com', 'user', 'Institution', 'PhD', 'Technology');

    expect(result).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      '/users/login',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
          institution: 'Institution',
          qualification: 'PhD',
          interests: 'Technology',
        }),
      })
    );
  });

  it('should throw an error if login fails', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Login failed' }), { status: 400 });

    await expect(
      login_service('John Doe', 'john.doe@example.com', 'user', 'Institution', 'PhD', 'Technology')
    ).rejects.toThrow('Login failed');
  });

  it('should handle network errors gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    await expect(
      login_service('John Doe', 'john.doe@example.com', 'user', 'Institution', 'PhD', 'Technology')
    ).rejects.toThrow('Network error');
  });
});

describe('get_Users', () => {
  it('should successfully fetch user data', async () => {
    const mockUserData = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    fetchMock.mockResponseOnce(JSON.stringify(mockUserData), { status: 200 });

    const result = await get_Users('john.doe@example.com');

    expect(result).toEqual(mockUserData);
    expect(fetchMock).toHaveBeenCalledWith(
      '/users/user',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'john.doe@example.com' }),
      })
    );
  });

  it('should throw an error if user fetching fails', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Failed to fetch user' }), { status: 400 });

    await expect(get_Users('john.doe@example.com')).rejects.toThrow('Failed to fetch user');
  });

  it('should handle network errors gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    await expect(get_Users('john.doe@example.com')).rejects.toThrow('Network error');
  });
});
