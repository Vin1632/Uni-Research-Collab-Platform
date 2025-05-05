import { get_project_data } from '../services/milestone_tracking_service';

beforeEach(() => {
  fetch.resetMocks();
});

describe('get_project_data', () => {
  it('should return project data when response is ok', async () => {
    const mockData = { id: 1, name: 'Test Project' };
    fetch.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

    const data = await get_project_data(1);
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/milestone/projectdata/1', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should throw an error when response is not ok', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'Project not found' }), { status: 404 });

    await expect(get_project_data(999)).rejects.toThrow('Project not found');
  });

  it('should throw a general error when fetch fails', async () => {
    fetch.mockReject(() => Promise.reject(new Error('Network failure')));

    await expect(get_project_data(1)).rejects.toThrow('Failed to get the project data');
  });
});
