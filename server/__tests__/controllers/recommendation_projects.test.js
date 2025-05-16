
const { get_recom_proj, get_project_data } = require('../../controllers/recommendation_projects');
const pool = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('get_recom_proj', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns projects not created by given user', async () => {
    const mockProjects = [
      { project_id: 1, user_id: 2, title: 'Project 1' },
      { project_id: 2, user_id: 3, title: 'Project 2' },
    ];

    pool.query.mockResolvedValue(mockProjects);

    const result = await get_recom_proj(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM projects WHERE user_id  != ?'),
      [1]
    );
    expect(result).toEqual(mockProjects);
  });

  test('throws error when query fails', async () => {
    const error = new Error('DB failure');
    pool.query.mockRejectedValue(error);

    await expect(get_recom_proj(1)).rejects.toThrow(error);
  });
});

describe('get_project_data', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns project data when available', async () => {
    const mockProjectData = [[
      { project_id: 1, title: 'Test', requirements: 'Reqs' },
      { project_id: 1, title: 'Test2', requirements: 'More Reqs' }
    ]];

    pool.query.mockResolvedValue(mockProjectData);

    const result = await get_project_data(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM projectdata where project_id = ?'),
      [1]
    );
    expect(result).toEqual(mockProjectData[0]);
  });

  test('returns empty array when no project data found', async () => {
    // Simulate empty results
    pool.query.mockResolvedValue([[]]);

    const result = await get_project_data(999);

    expect(result).toEqual([]);
  });

  test('throws error when query fails', async () => {
    const error = new Error('DB failure');
    pool.query.mockRejectedValue(error);

    await expect(get_project_data(1)).rejects.toThrow(error);
  });
});
