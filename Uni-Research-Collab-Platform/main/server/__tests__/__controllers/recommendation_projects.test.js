const { get_recom_proj, get_project_data } = require('../../controllers/recommendation_projects');
const pool = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Project Controller Functions', () => {

  describe('get_recom_proj', () => {
    it('should return all projects that the user hasn\'t created', async () => {
      const mockResult = [
        { project_id: 1, user_id: 2, title: 'Project A' },
        { project_id: 2, user_id: 3, title: 'Project B' },
      ];
      pool.query.mockResolvedValue(mockResult);

      const result = await get_recom_proj(1);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM projects WHERE user_id  != ?", [1]
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if the query fails', async () => {
      pool.query.mockRejectedValue(new Error('DB Error'));

      await expect(get_recom_proj(1)).rejects.toThrow('DB Error');
    });
  });

  describe('get_project_data', () => {
    it('should return project data for a given project_id', async () => {
      const mockResult = [
        { project_id: 1, title: 'Project A', requirements: 'Some requirements', funding: 5000 }
      ];
      pool.query.mockResolvedValue(mockResult);

      const result = await get_project_data(1);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM projectdata where project_id = ? ", [1]
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if the query fails', async () => {
      pool.query.mockRejectedValue(new Error('Failed to fetch project data'));

      await expect(get_project_data(1)).rejects.toThrow('Failed to fetch project data');
    });
  });

});
