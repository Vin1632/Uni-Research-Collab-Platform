import { get_recom_projects } from '../../services/recom_services';

beforeEach(() => {
  fetch.resetMocks();
});

test('should return project data when fetch is successful', async () => {
  const mockData = [{ id: 1, title: 'Project A' }];

  fetch.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

  const result = await get_recom_projects(1);

  expect(result).toEqual(mockData);
  expect(fetch).toHaveBeenCalledWith('/projects/recom-projects/1', expect.any(Object));
});

test('should throw an error with message from server when fetch fails with custom message', async () => {
  const errorMessage = { message: 'Custom server error' };

  fetch.mockResponseOnce(JSON.stringify(errorMessage), { status: 400 });

  await expect(get_recom_projects(1)).rejects.toThrow('Custom server error');
});

test('should throw generic error if fetch fails without a custom message', async () => {
  fetch.mockResponseOnce('{}', { status: 500 });

  await expect(get_recom_projects(1)).rejects.toThrow('failed to fetch data-1');
});

test('should throw error when fetch itself fails (network error)', async () => {
  fetch.mockReject(() => Promise.reject('Network error'));

  await expect(get_recom_projects(1)).rejects.toThrow('Failed to get the error');
});
