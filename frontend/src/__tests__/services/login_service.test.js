import { login_service, get_Users } from '../../services/login_service';

global.fetch = jest.fn();

describe('login_service', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('should return user data when login is successful', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await login_service('John Doe', 'john@example.com', 'user', 'MIT', 'PhD', ['AI']);
    expect(result).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith('/users/login', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  it('should throw an error when login fails', async () => {
    const mockError = { message: 'Invalid credentials' };

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    await expect(login_service('John Doe', 'wrong@example.com', 'user', 'MIT', 'PhD', ['AI']))
      .rejects.toThrow('Invalid credentials');
  });
});

describe('get_Users', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('should return user data when fetch is successful', async () => {
    const mockUser = { id: 2, name: 'Jane Smith' };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await get_Users('jane@example.com');
    expect(result).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith('/users/user', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'jane@example.com' }),
    }));
  });

  it('should throw an error when fetch fails', async () => {
    const mockError = { message: 'User not found' };

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    await expect(get_Users('nonexistent@example.com'))
      .rejects.toThrow('User not found');
  });
});
