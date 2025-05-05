const { get_users_projects } = require('../../controllers/milestone_tracking_controller');
const pool = require('../../db');

jest.mock('../../db', () => ({
    query: jest.fn(),
}));

describe('get_users_projects', () => {

    const mockId = 1;

    it('should return projects for a valid user ID', async () => {
        const mockProjects = [{ id: 1, name: 'Test Project', user_id: mockId }];
        pool.query.mockResolvedValue(mockProjects);

        const result = await get_users_projects(mockId);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM projects WHERE user_id = ?", [mockId]);
        expect(result).toEqual(mockProjects);
    });

    it('should throw an error if the query fails', async () => {
        const error = new Error('Database error');
        pool.query.mockRejectedValue(error);

        await expect(get_users_projects(mockId)).rejects.toThrow('Database error');
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM projects WHERE user_id = ?", [mockId]);
    });

});
