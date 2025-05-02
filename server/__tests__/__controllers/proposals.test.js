const db = require('../../db'); 
const { insert_proposals, insert_projectData } = require('../../controllers/proposals');

// Mock db
jest.mock('../../db', () => ({
    query: jest.fn()
}));

describe('insert_proposals', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should insert proposal and return the project_id', async () => {
        db.query
            .mockResolvedValueOnce([{ affectedRows: 1 }]) // insert query
            .mockResolvedValueOnce([[{ project_id: 123 }]]); // select LAST_INSERT_ID()

        const result = await insert_proposals(
            1, 'Test Title', 'Test Description', null,
            '2025-01-01', '2025-12-31'
        );

        expect(db.query).toHaveBeenCalledTimes(2);
        expect(result).toEqual([{ project_id: 123 }]);
    });

    it('should throw an error if insert affects 0 rows', async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        await expect(insert_proposals(
            1, 'Test Title', 'Test Description', null,
            '2025-01-01', '2025-12-31'
        )).rejects.toThrow('Insert failed: No rows affected.');
    });

    it('should throw and log error on query failure', async () => {
        const error = new Error('Query error');
        db.query.mockRejectedValue(error);

        await expect(insert_proposals(
            1, 'Test', 'Test Desc', null, '2025-01-01', '2025-12-31'
        )).rejects.toThrow('Query error');
    });
});

describe('insert_projectData', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should insert project data successfully', async () => {
        db.query.mockResolvedValueOnce({ insertId: 456 });

        const result = await insert_projectData(
            123, 'Test', 'Reqs', 'img.png', 1000, 'Gov Grant', '2025-01-01', '2025-12-31'
        );

        expect(db.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ insertId: 456 });
    });

    it('should throw and log error on failure', async () => {
        const error = new Error('Insert failed');
        db.query.mockRejectedValueOnce(error);

        await expect(insert_projectData(
            123, 'Test', 'Reqs', 'img.png', 1000, 'Gov Grant', '2025-01-01', '2025-12-31'
        )).rejects.toThrow('Insert failed');
    });
});
