import {
    get_flagged_projects,
    delete_flag,
    delete_project,
    get_each_project_data,
    get_all_users
  } from '../../services/admin_service';
  
  beforeEach(() => {
    fetch.resetMocks();
  });
  
  describe('get_flagged_projects', () => {
    it('should return flagged projects on success', async () => {
      const mockData = [{ id: 1, reason: 'Inappropriate content' }];
      fetch.mockResponseOnce(JSON.stringify(mockData));
  
      const result = await get_flagged_projects();
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/admin/flagged-projects', expect.any(Object));
    });
  
    it('should throw error when JSON parse fails', async () => {
      fetch.mockResponseOnce('INVALID_JSON');
  
      await expect(get_flagged_projects()).rejects.toThrow();
    });
  
    it('should throw error if response is not ok with valid JSON', async () => {
      fetch.mockResponseOnce(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  
      await expect(get_flagged_projects()).rejects.toThrow('Unauthorized');
    });
  });
  
  describe('delete_flag', () => {
    it('should delete a flag and return success data', async () => {
      const mockData = { success: true };
      fetch.mockResponseOnce(JSON.stringify(mockData));
  
      const result = await delete_flag(123);
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/admin/flagged-projects/123', expect.any(Object));
    });
  
    it('should throw error if server returns error JSON', async () => {
      fetch.mockResponseOnce(JSON.stringify({ message: 'Flag not found' }), { status: 404 });
  
      await expect(delete_flag(123)).rejects.toThrow('Flag not found');
    });
  
    it('should throw error when response is not valid JSON', async () => {
      fetch.mockResponseOnce('Not JSON', { status: 200 });
  
      await expect(delete_flag(123)).rejects.toThrow();
    });
  });
  
  describe('delete_project', () => {
    it('should delete a project and return confirmation', async () => {
      const mockData = { success: true };
      fetch.mockResponseOnce(JSON.stringify(mockData));
  
      const result = await delete_project(456);
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/admin/projects/456', expect.any(Object));
    });
  
    it('should throw error when deletion fails', async () => {
      fetch.mockResponseOnce(JSON.stringify({ message: 'Cannot delete' }), { status: 403 });
  
      await expect(delete_project(456)).rejects.toThrow('Cannot delete');
    });
  });
  
  describe('get_each_project_data', () => {
    it('should return project data by ID', async () => {
      const mockData = { id: 789, title: 'AI Project' };
      fetch.mockResponseOnce(JSON.stringify(mockData));
  
      const result = await get_each_project_data(789);
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/admin/projects/789', expect.any(Object));
    });
  
    it('should throw error when fetch fails', async () => {
      fetch.mockResponseOnce(JSON.stringify({ message: 'Not Found' }), { status: 404 });
  
      await expect(get_each_project_data(789)).rejects.toThrow('Not Found');
    });
  });
  
  describe('get_all_users', () => {
    it('should return user list on success', async () => {
      const mockUsers = [{ id: 1, name: 'Admin' }];
      fetch.mockResponseOnce(JSON.stringify(mockUsers));
  
      const result = await get_all_users();
      expect(result).toEqual(mockUsers);
      expect(fetch).toHaveBeenCalledWith('/admin/users', expect.any(Object));
    });
  
    it('should throw error for bad JSON response', async () => {
      fetch.mockResponseOnce('Non-JSON');
  
      await expect(get_all_users()).rejects.toThrow();
    });
  
    it('should throw error if server returns failure JSON', async () => {
      fetch.mockResponseOnce(JSON.stringify({ message: 'Access denied' }), { status: 403 });
  
      await expect(get_all_users()).rejects.toThrow('Access denied');
    });
  });

  