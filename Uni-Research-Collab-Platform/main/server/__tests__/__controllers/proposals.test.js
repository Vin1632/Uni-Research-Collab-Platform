const { insert_proposals, insert_projectData, get_project_id } = require('../../controllers/proposals');
const pool = require('../../db');


jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Proposal Controller Functions', () => {
  
  describe('insert_proposals', () => {
    it('should insert a proposal and return the result', async () => {
      const mockResult = { insertId: 1 };
      pool.query.mockResolvedValue(mockResult);

      const result = await insert_proposals(1, 'Test Title', 'Test Desc', 'http://image.url');

      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO Projects(user_id, title, description, link_image) VALUES (?, ?, ?, ?)",
        [1, 'Test Title', 'Test Desc', 'http://image.url']
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if insert fails', async () => {
      pool.query.mockRejectedValue(new Error('DB Error'));

      await expect(insert_proposals(1, 'Fail', 'Fail', 'fail.jpg')).rejects.toThrow('DB Error');
    });
  });

  describe('insert_projectData', () => {
    it('should insert project data and return the result', async () => {
      const mockResult = { insertId: 101 };
      pool.query.mockResolvedValue(mockResult);

      const result = await insert_projectData(
        1, 'Project Title', 'Some Requirements', 'link.jpg', 5000, 'Gov Fund'
      );

      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO ProjectData(project_id, title, requirements, link_image, funding, funding_source) VALUES (?, ?, ?, ?, ?, ?)",
        [1, 'Project Title', 'Some Requirements', 'link.jpg', 5000, 'Gov Fund']
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if project data insert fails', async () => {
      pool.query.mockRejectedValue(new Error('Insert Error'));

      await expect(insert_projectData(
        2, 'X', 'Y', 'Z', 0, 'None'
      )).rejects.toThrow('Insert Error');
    });
  });

  describe('get_project_id', () => {
    it('should return project_id by user_id', async () => {
      const mockResult = [{ project_id: 42 }];
      pool.query.mockResolvedValue(mockResult);

      const result = await get_project_id(7);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT project_id FROM Projects WHERE user_id = ?", [7]
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if query fails', async () => {
      pool.query.mockRejectedValue(new Error('Select Error'));

      await expect(get_project_id(99)).rejects.toThrow('Select Error');
    });
  });
});
