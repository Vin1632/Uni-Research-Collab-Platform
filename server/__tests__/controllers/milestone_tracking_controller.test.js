// getUsersProjects.test.js
const { get_users_projects } = require('../../controllers/milestone_tracking_controller');
const pool = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('get_users_projects', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns projects for given user id', async () => {
    const mockProjects = [
      { project_id: 1, user_id: 42, title: 'Project One' },
      { project_id: 2, user_id: 42, title: 'Project Two' },
    ];
    
    // Mock pool.query to resolve with mockProjects
    pool.query.mockResolvedValue(mockProjects);

    const result = await get_users_projects(42);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM projects WHERE user_id = ?",
      [42]
    );
    expect(result).toEqual(mockProjects);
  });

  test('throws error when query fails', async () => {
    const errorMessage = 'DB error';
    pool.query.mockRejectedValue(new Error(errorMessage));

    await expect(get_users_projects(99)).rejects.toThrow(errorMessage);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM projects WHERE user_id = ?",
      [99]
    );
  });
});
