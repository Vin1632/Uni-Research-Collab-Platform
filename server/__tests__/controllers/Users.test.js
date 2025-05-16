
const { insert_Users, get_User_By_Email } = require('../../controllers/Users');
const pool = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('insert_Users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('successfully inserts a user and returns result', async () => {
    const mockResult = { affectedRows: 1 };
    pool.query.mockResolvedValue(mockResult);

    const result = await insert_Users('John Doe', 'john@example.com', 'researcher', 'Uni', 'PhD', 'AI, ML');

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Users'),
      ['John Doe', 'john@example.com', 'researcher', 'Uni', 'PhD', 'AI, ML']
    );
    expect(result).toEqual(mockResult);
  });

  test('throws error with message on duplicate email', async () => {
    const duplicateError = new Error('Duplicate entry');
    duplicateError.code = 'ER_DUP_ENTRY';
    pool.query.mockRejectedValue(duplicateError);

    await expect(insert_Users('John Doe', 'john@example.com', 'researcher', 'Uni', 'PhD', 'AI, ML'))
      .rejects.toThrow('User with this email already exists');
  });

  test('throws generic error on other failures', async () => {
    const otherError = new Error('Some DB error');
    pool.query.mockRejectedValue(otherError);

    await expect(insert_Users('John Doe', 'john@example.com', 'researcher', 'Uni', 'PhD', 'AI, ML'))
      .rejects.toThrow('Failed to add a User');
  });
});

describe('get_User_By_Email', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns user data if email found', async () => {
    const mockUserData = [[{ email: 'john@example.com', user_id: 1, role: 'researcher' }]];
    pool.query.mockResolvedValue(mockUserData);

    const result = await get_User_By_Email({ email: 'john@example.com' });

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT email, user_id, role FROM Users WHERE email = ?'),
      ['john@example.com']
    );
    expect(result).toEqual(mockUserData[0]);
  });

  test('returns empty array if no user found', async () => {
    pool.query.mockResolvedValue([[]]);

    const result = await get_User_By_Email({ email: 'notfound@example.com' });

    expect(result).toEqual([]);
  });

  test('throws error on query failure', async () => {
    const queryError = new Error('DB query failed');
    pool.query.mockRejectedValue(queryError);

    await expect(get_User_By_Email({ email: 'john@example.com' })).rejects.toThrow(queryError);
  });
});
