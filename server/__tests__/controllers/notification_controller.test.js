const pool = require('../../db');
const {
  get_notifs,
  get_project_by_id,
  respond_to_invitation,
} = require('../../controllers/notification_controllers'); 

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Notifications Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get_notifs', () => {
    it('should return notifications for a given user ID', async () => {
      const mockRows = [{
        sender_email: 'sender@example.com',
        collaborator_email: 'collab@example.com',
        project_title: 'Project A',
        project_id: 1,
        invitation: 'pending',
        added_at: '2024-01-01T00:00:00Z',
      }];

      pool.query.mockResolvedValue([mockRows]);

      const result = await get_notifs(5);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [5]);
      expect(result).toEqual(mockRows);
    });

    it('should throw and log error if query fails', async () => {
      const error = new Error('DB error');
      pool.query.mockRejectedValue(error);
      console.error = jest.fn();

      await expect(get_notifs(5)).rejects.toThrow('DB error');
      expect(console.error).toHaveBeenCalledWith('Failed to get notifications:', error);
    });
  });

  describe('get_project_by_id', () => {
    it('should return project details when project exists', async () => {
      const mockRow = {
        project_id: 1,
        title: 'Title',
        description: 'Desc',
        link_image: 'img.png',
        requirements: 'reqs',
        funds: 1000,
        funding_source: 'Gov',
        start_date: '2024-01-01',
        end_date: '2025-01-01',
      };
      pool.query.mockResolvedValue([[mockRow]]);

      const result = await get_project_by_id(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
      expect(result).toEqual(mockRow);
    });

    it('should throw an error if project is not found', async () => {
      pool.query.mockResolvedValue([[]]);
      await expect(get_project_by_id(999)).rejects.toThrow('Project not found');
    });

    it('should log and throw an error on DB failure', async () => {
      const error = new Error('DB crash');
      pool.query.mockRejectedValue(error);
      console.error = jest.fn();

      await expect(get_project_by_id(1)).rejects.toThrow('DB crash');
      expect(console.error).toHaveBeenCalledWith('Error fetching project:', error);
    });
  });

  describe('respond_to_invitation', () => {
    it('should return a success message if update occurs', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await respond_to_invitation(2, 10, 'accepted');

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE Collaborators'), ['accepted', 2, 10]);
      expect(result).toEqual({ message: 'Invitation accepted' });
    });

    it('should throw an error if no invitation matches', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);
      await expect(respond_to_invitation(99, 88, 'declined')).rejects.toThrow('No matching invitation found');
    });

    it('should throw and log error on DB failure', async () => {
      const error = new Error('DB failure');
      pool.query.mockRejectedValue(error);
      console.error = jest.fn();

      await expect(respond_to_invitation(2, 10, 'declined')).rejects.toThrow('DB failure');
      expect(console.error).toHaveBeenCalledWith('Error responding to invitation:', error);
    });
  });
});
