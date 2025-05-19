const pool = require('../../db');
const { insert_invitations, get_email_project_id } = require('../../controllers/invite_collab_controllers'); 

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Invitations Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insert_invitations', () => {
    it('should insert invitation when sender, recipient, and project exist', async () => {
      const senderEmail = 'sender@example.com';
      const recipientEmail = 'recipient@example.com';
      const title = 'Project X';

      pool.query
        .mockResolvedValueOnce([[{ user_id: 1 }]])  // Sender
        .mockResolvedValueOnce([[{ user_id: 2 }]])  // Recipient
        .mockResolvedValueOnce([[{ project_id: 10 }]])  // Project
        .mockResolvedValueOnce([{ insertId: 99, affectedRows: 1 }]);  // Insert

      const result = await insert_invitations(recipientEmail, senderEmail, title);

      expect(pool.query).toHaveBeenCalledTimes(4);
      expect(result).toEqual({ insertId: 99, affectedRows: 1 });
    });

    it('should throw error when sender, recipient, or project is missing', async () => {
      pool.query
        .mockResolvedValueOnce([[]])  // Sender not found
        .mockResolvedValueOnce([[{ user_id: 2 }]])
        .mockResolvedValueOnce([[{ project_id: 10 }]]);

      await expect(
        insert_invitations('recipient@example.com', 'sender@example.com', 'Project X')
      ).rejects.toThrow('Insert failed: One or more references not found.');
    });

    it('should throw and log error on DB failure', async () => {
      const error = new Error('Database failure');
      pool.query.mockRejectedValue(error);
      console.error = jest.fn();

      await expect(
        insert_invitations('recipient@example.com', 'sender@example.com', 'Project X')
      ).rejects.toThrow('Database failure');

      expect(console.error).toHaveBeenCalledWith(
        'Failed to insert into Collaborators table:',
        error
      );
    });
  });

  describe('get_email_project_id', () => {
    it('should return email of project owner given project ID', async () => {
      pool.query
        .mockResolvedValueOnce([[{ user_id: 5 }]]) // First query for user_id
        .mockResolvedValueOnce([[{ email: 'owner@example.com' }]]); // Second for email

      const result = await get_email_project_id(42);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(result).toBe('owner@example.com');
    });

    it('should return undefined if no user is found for project ID', async () => {
      pool.query.mockResolvedValueOnce([[]]); // Project not found

      const result = await get_email_project_id(999);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT user_id FROM projects'),
        [999]
      );
      expect(result).toBeUndefined();
    });

    it('should throw and log error if query fails', async () => {
      const error = new Error('Query failed');
      pool.query.mockRejectedValue(error);
      console.error = jest.fn();

      await expect(get_email_project_id(1)).rejects.toThrow('Query failed');
      expect(console.error).toHaveBeenCalledWith(
        'Failed to GET eamil using Project_Id',
        error
      );
    });
  });
});
