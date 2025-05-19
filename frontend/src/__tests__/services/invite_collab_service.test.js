import { invite_collaboration, email_using_project_id } from '../../services/invite_collab_services';

beforeEach(() => {
  fetch.resetMocks();
});

describe('invite_collaboration', () => {
  it('should send an invite successfully and return response JSON', async () => {
    const mockResponse = { success: true, message: 'Invite sent' };
    fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await invite_collaboration('test@example.com', 'User1', 'Project X');

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      '/invite/send-invite',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: 'test@example.com',
          fromUser: 'User1',
          projectTitle: 'Project X',
        }),
      }),
    );
  });

  it('should throw error with message if response not ok', async () => {
    const errorMsg = { message: 'Invitation failed' };
    fetch.mockResponseOnce(JSON.stringify(errorMsg), { status: 400 });

    await expect(invite_collaboration('fail@example.com', 'User2', 'Project Y'))
      .rejects.toThrow('Invitation failed');
  });

  it('should throw the original error if fetch rejects', async () => {
    fetch.mockRejectOnce(new Error('Network error'));

    await expect(invite_collaboration('fail@example.com', 'User2', 'Project Y'))
      .rejects.toThrow('Network error');
  });
});

describe('email_using_project_id', () => {
  it('should return email info successfully for given project id', async () => {
    const mockResponse = { email: 'invitee@example.com' };
    fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await email_using_project_id(123);

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      '/invite/send-invite/123',
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('should throw error with message if response not ok', async () => {
    const errorMsg = { message: 'Project not found' };
    fetch.mockResponseOnce(JSON.stringify(errorMsg), { status: 404 });

    await expect(email_using_project_id(999))
      .rejects.toThrow('Project not found');
  });

  it('should throw the original error if fetch rejects', async () => {
    fetch.mockRejectOnce(new Error('Network error'));

    await expect(email_using_project_id(999))
      .rejects.toThrow('Network error');
  });
});
