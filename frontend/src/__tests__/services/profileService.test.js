import { get_profile_data, update_profile_data } from '../../services/profileService';

beforeEach(() => {
  fetch.resetMocks();
});

describe('get_profile_data', () => {
  it('should return profile data when fetch is successful', async () => {
    const mockProfile = { name: 'Alice', email: 'alice@example.com' };
    fetch.mockResponseOnce(JSON.stringify(mockProfile), { status: 200 });

    const data = await get_profile_data('alice@example.com');

    expect(data).toEqual(mockProfile);
    expect(fetch).toHaveBeenCalledWith(
      '/profiles/profile?email=alice%40example.com',
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('should throw an error with server message if response not ok', async () => {
    const errorMessage = { message: 'Profile not found' };
    fetch.mockResponseOnce(JSON.stringify(errorMessage), { status: 404 });

    await expect(get_profile_data('notfound@example.com')).rejects.toThrow('Profile not found');
  });

  it('should throw the original error if fetch rejects', async () => {
    fetch.mockRejectOnce(new Error('Network error'));

    await expect(get_profile_data('any@example.com')).rejects.toThrow('Network error');
  });
});

describe('update_profile_data', () => {
  it('should return updated profile data when fetch is successful', async () => {
    const profileToUpdate = { name: 'Bob', email: 'bob@example.com' };
    const updatedProfile = { ...profileToUpdate, name: 'Bobby' };
    fetch.mockResponseOnce(JSON.stringify(updatedProfile), { status: 200 });

    const data = await update_profile_data(profileToUpdate);

    expect(data).toEqual(updatedProfile);
    expect(fetch).toHaveBeenCalledWith(
      '/profiles/profile',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToUpdate),
      }),
    );
  });

  it('should throw an error with server message if update response not ok', async () => {
    const errorMessage = { message: 'Update failed' };
    fetch.mockResponseOnce(JSON.stringify(errorMessage), { status: 400 });

    const profile = { name: 'Bob', email: 'bob@example.com' };
    await expect(update_profile_data(profile)).rejects.toThrow('Update failed');
  });

  it('should throw the original error if fetch rejects during update', async () => {
    fetch.mockRejectOnce(new Error('Network error'));

    const profile = { name: 'Bob', email: 'bob@example.com' };
    await expect(update_profile_data(profile)).rejects.toThrow('Network error');
  });
});
