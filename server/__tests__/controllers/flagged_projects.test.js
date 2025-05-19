const pool = require('../../db');
const {
  flag_project,
  get_flagged_projects,
  delete_flag,
  delete_project,
} = require('../../controllers/flagged_projects');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Flagged Projects Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('flag_project', () => {
    it('should insert a flag into flagged_projects', async () => {
      const mockResult = { insertId: 1, affectedRows: 1 };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await flag_project(10, 2, 'Plagiarism', 'Copied from another proposal');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO flagged_projects'),
        [10, 2, 'Plagiarism', 'Copied from another proposal']
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw and log error if query fails', async () => {
      const error = new Error('Insert failed');
      pool.query.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await expect(flag_project(10, 2, 'Inappropriate', 'Content violation')).rejects.toThrow('Insert failed');
      expect(console.error).toHaveBeenCalledWith('Failed to flag project', error);
    });
  });

  describe('get_flagged_projects', () => {
    it('should return all flagged projects', async () => {
      const mockRows = [
        {
          flag_id: 1,
          project_id: 10,
          flagged_by_user_id: 2,
          reason: 'Inappropriate',
          description: 'Spam content',
          flagged_at: '2024-01-01',
          title: 'AI Research',
        },
      ];
      pool.query.mockResolvedValueOnce(mockRows);

      const result = await get_flagged_projects();
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT f.flag_id'));
      expect(result).toEqual(mockRows);
    });

    it('should throw and log error if retrieval fails', async () => {
      const error = new Error('Fetch failed');
      pool.query.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await expect(get_flagged_projects()).rejects.toThrow('Fetch failed');
      expect(console.error).toHaveBeenCalledWith('Failed to retrieve flagged projects', error);
    });
  });

  describe('delete_flag', () => {
    it('should delete a flag by ID', async () => {
      const mockResult = { affectedRows: 1 };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await delete_flag(1);
      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM flagged_projects WHERE flag_id = ?',
        [1]
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw and log error if deletion fails', async () => {
      const error = new Error('Delete failed');
      pool.query.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await expect(delete_flag(1)).rejects.toThrow('Delete failed');
      expect(console.error).toHaveBeenCalledWith('Failed to delete flag', error);
    });
  });

  describe('delete_project', () => {
    it('should delete a project and associated data', async () => {
      const mockResult = { affectedRows: 2 };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await delete_project(10);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE p, pd FROM projects p JOIN projectdata pd'),
        [10]
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw and log error if project deletion fails', async () => {
      const error = new Error('Project delete error');
      pool.query.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await expect(delete_project(10)).rejects.toThrow('Project delete error');
      expect(console.error).toHaveBeenCalledWith('Failed to delete project', error);
    });
  });
});
