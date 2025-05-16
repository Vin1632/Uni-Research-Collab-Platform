import { get_project_data } from '../../services/milestone_tracking_service';

// Mock global fetch
global.fetch = jest.fn();

describe('get_project_data', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('should return project data when fetch is successful', async () => {
    const mockProjectData = { id: 1, name: 'Project Alpha' };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjectData,
    });

    const result = await get_project_data(1);
    expect(result).toEqual(mockProjectData);
    expect(fetch).toHaveBeenCalledWith('/milestone/projectdata/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should throw an error with server message when fetch fails with response', async () => {
    const mockErrorData = { message: 'Project not found' };

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorData,
    });

    await expect(get_project_data(99)).rejects.toThrow('Project not found');
  });

  it('should throw a generic error when fetch throws an exception', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(get_project_data(123)).rejects.toThrow('Failed to get the project data');
  });
});
