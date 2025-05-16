import {
    proposal_service,
    insert_projectData,
    get_project_data,
    get_each_project_data,
    get_image_url,
  } from '../../services/proposal_service';
  
  import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
  global.fetch = jest.fn();
  jest.mock('firebase/storage', () => ({
    ref: jest.fn(),
    uploadBytesResumable: jest.fn(),
    getDownloadURL: jest.fn(),
    getStorage: jest.fn(() => ({})),
  }));
  
  describe('proposal_service', () => {
    afterEach(() => {
      fetch.mockClear();
    });
  
    it('should post project proposal successfully', async () => {
      const mockResponse = { success: true };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await proposal_service(1, 'Test', 'Desc', 'img.png', '2025-01-01', '2025-12-31');
      expect(result).toEqual(mockResponse);
    });
  
    it('should throw error on failed proposal post', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Server error' }),
      });
  
      await expect(proposal_service(1, 'Test', 'Desc', 'img.png', '2025-01-01', '2025-12-31'))
        .rejects.toThrow('Server error');
    });
  });
  
  describe('insert_projectData', () => {
    afterEach(() => {
      fetch.mockClear();
    });
  
    it('should insert project data successfully', async () => {
      const mockResponse = { id: 2 };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await insert_projectData(1, 'Title', 'Reqs', 'img.png', 5000, 'Gov', '2025-01-01', '2025-12-31');
      expect(result).toEqual(mockResponse);
    });
  
    it('should throw error on failed insert', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Insert failed' }),
      });
  
      await expect(insert_projectData(1, 'Title', 'Reqs', 'img.png', 5000, 'Gov', '2025-01-01', '2025-12-31'))
        .rejects.toThrow('Insert failed');
    });
  });
  
  describe('get_project_data', () => {
    afterEach(() => {
      fetch.mockClear();
    });
  
    it('should fetch recommended project data', async () => {
      const mockData = { name: 'Project A' };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
  
      const result = await get_project_data(5);
      expect(result).toEqual(mockData);
    });
  
    it('should handle failed recommended project fetch', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Not found' }),
      });
  
      await expect(get_project_data(5)).rejects.toThrow('Not found');
    });
  });
  
  describe('get_each_project_data', () => {
    afterEach(() => {
      fetch.mockClear();
    });
  
    it('should fetch specific project data', async () => {
      const mockData = { id: 3, title: 'Individual Project' };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
  
      const result = await get_each_project_data(3);
      expect(result).toEqual(mockData);
    });
  
    it('should handle fetch error for specific project data', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Project not found' }),
      });
  
      await expect(get_each_project_data(3)).rejects.toThrow('Project not found');
    });
  });
  
  describe('get_image_url', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return empty string if no image is provided', async () => {
      const result = await get_image_url(null);
      expect(result).toBe('');
    });
  
    it('should upload image and return download URL', async () => {
      const fakeImage = { name: 'test.png', type: 'image/png' };
      const mockRef = {};
      const mockSnapshot = { ref: 'mockRef' };
      const mockUploadTask = {
        on: (event, progress, error, success) => success(),
        snapshot: mockSnapshot,
      };
  
      ref.mockReturnValue(mockRef);
      uploadBytesResumable.mockReturnValue(mockUploadTask);
      getDownloadURL.mockResolvedValue('https://firebase.mock/image.png');
  
      const result = await get_image_url(fakeImage);
  
      expect(ref).toHaveBeenCalledWith(expect.anything(), 'files/test.png');
      expect(uploadBytesResumable).toHaveBeenCalled();
      expect(result).toBe('https://firebase.mock/image.png');
    });
  
    it('should return empty string on upload failure', async () => {
      const fakeImage = { name: 'error.png', type: 'image/png' };
      const mockUploadTask = {
        on: (event, progress, error, success) => error(new Error('Upload failed')),
      };
  
      uploadBytesResumable.mockReturnValue(mockUploadTask);
  
      const result = await get_image_url(fakeImage);
      expect(result).toBe('');
    });
  });
  