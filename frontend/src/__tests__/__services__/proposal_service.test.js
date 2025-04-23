// proposal_service.test.js
import { proposal_service, get_project_id, insert_projectData, get_project_data } from '../../services/proposal_service';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Proposal Service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should throw an error if the project proposal fails', async () => {
    const errorResponse = { message: 'Failed to add project' };
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 400 });

    await expect(proposal_service(1, 'Project Title', 'Project Description', 'image-link'))
      .rejects.toThrow('Failed to add project');
  });

  it('should throw an error if fetching project id fails', async () => {
    const errorResponse = { message: 'Failed to get the project_id' };
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 400 });

    await expect(get_project_id(1))
      .rejects.toThrow('Failed to get the project_id');
  });

  it('should successfully insert project data', async () => {
    const mockResponse = { success: true };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await insert_projectData(1, 'Project Title', 'Requirements', 'image-link', 10000, 'Government');

    expect(result).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      '/projects/projectdata',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 1,
          title: 'Project Title',
          requirements: 'Requirements',
          link_image: 'image-link',
          funding: 10000,
          funding_source: 'Government',
        }),
      })
    );
  });

  it('should throw an error if inserting project data fails', async () => {
    const errorResponse = { message: 'Failed to insert project data' };
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 400 });

    await expect(insert_projectData(1, 'Project Title', 'Requirements', 'image-link', 10000, 'Government'))
      .rejects.toThrow('Failed to insert project data');
  });

  it('should throw an error if fetching project data fails', async () => {
    const errorResponse = { message: 'Failed to get the project data' };
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 400 });

    await expect(get_project_data(1))
      .rejects.toThrow('Failed to get the project data');
  });
});
