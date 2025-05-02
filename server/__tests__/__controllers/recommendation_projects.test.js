const db = require('../../db'); 
const { get_recom_proj, get_project_data } = require('../../controllers/recommendation_projects');

// Mock db
jest.mock('../db', () => ({
    query: jest.fn()
}));

describe('get_recom_proj', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return projects not created by the user', async () => {
        const fakeProjects = [
            { id: 1, title: 'Proj A', user_id: 2 },
            { id: 2, title: 'Proj B', user_id: 3 }
        ];
        db.query.mockResolvedValueOnce([fakeProjects]);

        const result = await get_recom_proj(1);

        expect(db.query).toHaveBeenCalledWith(
            "SELECT * FROM projects WHERE user_id  != ?", [1]
        );
        expect(result).toEqual([fakeProjects]);
    });

    it('should throw and log error on failure', async () => {
        const error = new Error('DB failure');
        db.query.mockRejectedValueOnce(error);

        await expect(get_recom_proj(1)).rejects.toThrow('DB failure');
    });
});

describe('get_project_data', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return project data if found', async () => {
        const fakeData = [
            { id: 10, project_id: 1, title: 'Detail A' }
        ];
        db.query.mockResolvedValueOnce([fakeData]);

        const result = await get_project_data(1);

        expect(db.query).toHaveBeenCalledWith(
            "SELECT * FROM projectdata where project_id = ? ", [1]
        );
        expect(result).toEqual(fakeData);
    });

    it('should return empty array if no data is found', async () => {
        db.query.mockResolvedValueOnce([[]]);

        const result = await get_project_data(999);

        expect(result).toEqual([]);
    });

    it('should throw and log error on DB failure', async () => {
        const error = new Error('DB crash');
        db.query.mockRejectedValueOnce(error);

        await expect(get_project_data(1)).rejects.toThrow('DB crash');
    });
});
