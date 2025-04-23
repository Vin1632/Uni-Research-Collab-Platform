const { insert_Users, get_User_By_Email } = require('../../controllers/Users');
const pool = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('User Controller Functions', () => {
  describe('insert_Users', () => {
    it('should insert a user and return the result', async () => {
      const mockResult = { insertId: 1 };
      pool.query.mockResolvedValue(mockResult);

      const result = await insert_Users('John Doe', 'john@example.com', 'admin', 'University A', 'PhD', 'AI');

      expect(result).toEqual(mockResult);
    });

    it('should handle duplicate entry errors and return an appropriate message', async () => {
      const duplicateError = new Error('Duplicate entry');
      duplicateError.code = 'ER_DUP_ENTRY';
      pool.query.mockRejectedValue(duplicateError);

      await expect(
        insert_Users('Jane Doe', 'john@example.com', 'admin', 'University B', 'Masters', 'Data Science')
      ).rejects.toThrow('User with this email already exists');
    });

    it('should throw an error if the query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB Error'));

      await expect(
        insert_Users('Invalid User', 'invalid@example.com', 'student', 'Some School', 'BSc', 'Physics')
      ).rejects.toThrow('Failed to add a User');
    });
  });

  describe('get_User_By_Email', () => {
    it('should return user data for the given email', async () => {
      const mockResult = [{ email: 'john@example.com', user_id: 1 }];
      pool.query.mockResolvedValue([mockResult]);

      const result = await get_User_By_Email({ email: 'john@example.com' });
      expect(result).toEqual(mockResult);
    });

    it('should return an empty array if no user is found', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await get_User_By_Email({ email: 'nonexistent@example.com' });
      expect(result).toEqual([]);
    });

    it('should throw an error if the query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB Error'));

      await expect(get_User_By_Email({ email: 'error@example.com' }))
        .rejects
        .toThrow('DB Error');
    });
  });
});
