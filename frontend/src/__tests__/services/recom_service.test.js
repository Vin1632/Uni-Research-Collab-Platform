import { get_recom_projects } from '../../services/recom_services';

global.fetch = jest.fn();

describe('get_recom_projects', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('should return data when fetch is successful', async () => {
    const mockData = [{ id: 1, title: 'Recom Project' }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await get_recom_projects(1);
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/projects/recom-projects/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should throw error with message from server if fetch fails with response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'No recommended projects found' }),
    });

    await expect(get_recom_projects(999)).rejects.toThrow('No recommended projects found');
  });

  it('should throw generic error if fetch throws', async () => {
    fetch.mockRejectedValueOnce(new Error('Network failure'));

    await expect(get_recom_projects(2)).rejects.toThrow('Failed to get the error');
  });
});
