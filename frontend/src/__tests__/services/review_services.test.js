import {
    get_active_projects,
    donate_to_project,
    get_my_reviews,
  } from '../../services/review_services';
  
  beforeEach(() => {
    fetch.resetMocks();
  });
  
  describe('get_active_projects', () => {
    it('should return active projects when response is ok', async () => {
      const mockProjects = [{ id: 1, name: 'Project A' }];
      fetch.mockResponseOnce(JSON.stringify(mockProjects));
  
      const result = await get_active_projects();
      expect(result).toEqual(mockProjects);
      expect(fetch).toHaveBeenCalledWith('/projects/active-projects', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  
    it('should throw an error when response is not ok', async () => {
      fetch.mockResponseOnce(JSON.stringify({ message: 'Error occurred' }), {
        status: 500,
      });
  
      await expect(get_active_projects()).rejects.toThrow('Error occurred');
    });
  });
  
  describe('donate_to_project', () => {
    const payload = {
      reviewer_id: 1,
      project_id: 2,
      donated_amt: 100,
    };
  
    it('should return success response on donation', async () => {
      const mockResponse = { success: true };
      fetch.mockResponseOnce(JSON.stringify(mockResponse));
  
      const result = await donate_to_project(payload);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/projects/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    });
  
    it('should throw error on failed donation', async () => {
      fetch.mockResponseOnce('Internal Server Error', { status: 500 });
  
      await expect(donate_to_project(payload)).rejects.toThrow('Donation failed');
    });
  });
  
  describe('get_my_reviews', () => {
    const reviewer_id = 123;
  
    it('should return reviews if fetch is successful', async () => {
      const mockReviews = [{ id: 1, comment: 'Great project' }];
      fetch.mockResponseOnce(JSON.stringify(mockReviews));
  
      const result = await get_my_reviews(reviewer_id);
      expect(result).toEqual(mockReviews);
      expect(fetch).toHaveBeenCalledWith(`/projects/my-reviews/${reviewer_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  
    it('should throw error if fetch fails', async () => {
      fetch.mockResponseOnce('Not found', { status: 404 });
  
      await expect(get_my_reviews(reviewer_id)).rejects.toThrow('Failed to fetch my reviews');
    });
  });
  