import { get_recom_projects } from '../services/recom_services'; 

global.fetch = jest.fn();

describe('get_recom_projects', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch project data successfully', async () => {
    const mockData = { projects: ['Project A', 'Project B'] };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await get_recom_projects('123');

    expect(fetch).toHaveBeenCalledWith('/projects/recom-projects/123', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockData);
  });

  it('should throw an error if response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Not Found' }),
    });

    await expect(get_recom_projects('456')).rejects.toThrow('Not Found');
  });

  it('should handle fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(get_recom_projects('789')).rejects.toThrow('Failed to get the error');
  });
});
