const { insert_Users, get_User_By_Email } = require('../controllers/Users');
const pool = require('../db');

jest.mock('../db', () => ({
  query: jest.fn()
}));

describe('insert_Users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert a user and return the result', async () => {
    const mockResult = { affectedRows: 1, insertId: 123 };
    pool.query.mockResolvedValue(mockResult);

    const result = await insert_Users('John Doe', 'john@example.com', 'user', 'Some Uni', 'PhD', 'AI');

    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO Users (name, email, role, institution, qualification, interests) VALUES (?, ?, ?, ?, ?, ?)",
      ['John Doe', 'john@example.com', 'user', 'Some Uni', 'PhD', 'AI']
    );
    expect(result).toBe(mockResult);
  });

  it('should throw a duplicate email error', async () => {
    const error = new Error('Duplicate entry');
    error.code = 'ER_DUP_ENTRY';
    pool.query.mockRejectedValue(error);

    await expect(insert_Users('John', 'john@example.com', 'user', '', '', '')).rejects.toThrow('User with this email already exists');
  });

  it('should throw a generic error for other DB issues', async () => {
    const error = new Error('Connection lost');
    pool.query.mockRejectedValue(error);

    await expect(insert_Users('Jane', 'jane@example.com', 'admin', '', '', '')).rejects.toThrow('Failed to add a User');
  });
});

describe('get_User_By_Email', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user info if email is found', async () => {
    const email = 'john@example.com';
    const mockUser = [{ email, user_id: 1, role: 'user' }];
    pool.query.mockResolvedValue([mockUser]);

    const result = await get_User_By_Email({ email });

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT email, user_id, role FROM Users WHERE email = ?",
      [email]
    );
    expect(result).toEqual(mockUser);
  });

  it('should return an empty array if no user is found', async () => {
    const email = 'noone@example.com';
    pool.query.mockResolvedValue([[]]);

    const result = await get_User_By_Email({ email });

    expect(result).toEqual([]);
  });

  it('should throw an error if query fails', async () => {
    const email = 'error@example.com';
    pool.query.mockRejectedValue(new Error('Query failed'));

    await expect(get_User_By_Email({ email })).rejects.toThrow('Query failed');
  });
});


