
const { insert_proposals, insert_projectData } = require('../../controllers/proposals');
const pool = require('../../db');

jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('insert_proposals', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('inserts proposal and returns last inserted id', async () => {
    // Mock successful insert result with affectedRows > 0
    pool.query
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // for INSERT INTO Projects
      .mockResolvedValueOnce([[{ project_id: 123 }]]); // for SELECT LAST_INSERT_ID()

    const result = await insert_proposals(
      42,
      'Test Title',
      'Test Description',
      'http://image.url',
      '2025-01-01',
      '2025-12-31'
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Projects'),
      [42, 'Test Title', 'Test Description', 'http://image.url', '2025-01-01', '2025-12-31']
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT LAST_INSERT_ID() as project_id')
    );

    expect(result).toEqual([{ project_id: 123 }]);
  });

  test('throws error if insert affects no rows', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]); // no rows affected

    await expect(
      insert_proposals(42, 'title', 'desc', null, null, null)
    ).rejects.toThrow('Insert failed: No rows affected.');

    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('throws error if query rejects', async () => {
    const error = new Error('DB error');
    pool.query.mockRejectedValue(error);

    await expect(
      insert_proposals(1, 'title', 'desc', null, null, null)
    ).rejects.toThrow(error);
  });
});

describe('insert_projectData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('inserts project data successfully', async () => {
    const mockResult = { insertId: 10 };
    pool.query.mockResolvedValue(mockResult);

    const result = await insert_projectData(
      123,
      'Title',
      'Requirements',
      'http://image.url',
      1000,
      'Source',
      '2025-01-01',
      '2025-12-31'
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO ProjectData'),
      [123, 'Title', 'Requirements', 'http://image.url', 1000, 'Source', '2025-01-01', '2025-12-31']
    );

    expect(result).toEqual(mockResult);
  });

  test('throws error if insert_projectData query rejects', async () => {
    const error = new Error('Insert failed');
    pool.query.mockRejectedValue(error);

    await expect(
      insert_projectData(123, 'title', 'req', null, 0, 'source', null, null)
    ).rejects.toThrow(error);
  });
});
