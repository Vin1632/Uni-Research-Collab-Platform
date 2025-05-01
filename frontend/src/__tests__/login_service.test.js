import { login_service, get_Users } from '../services/login_service';

beforeEach(() => {
  fetch.resetMocks();
});

describe('login_service', () => {
  it('should return user data on successful login', async () => {
    const mockResponse = { userId: 1, name: 'John Doe' };
    fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const data = await login_service('John Doe', 'john@example.com', 'researcher', 'MIT', 'PhD', 'AI');
    expect(data).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('/users/login', expect.any(Object));
  });

  it('should throw an error on failed login', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });

    await expect(
      login_service('Jane Doe', 'jane@example.com', 'student', 'Harvard', 'BSc', 'ML')
    ).rejects.toThrow('Invalid credentials');
  });
});

describe('get_Users', () => {
  it('should return user data on success', async () => {
    const mockUser = { id: 1, email: 'john@example.com', name: 'John Doe' };
    fetch.mockResponseOnce(JSON.stringify(mockUser), { status: 200 });

    const result = await get_Users('john@example.com');
    expect(result).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith('/users/user', expect.any(Object));
  });

  it('should throw an error when user not found', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'User not found' }), { status: 404 });

    await expect(get_Users('ghost@example.com')).rejects.toThrow('User not found');
  });
});
