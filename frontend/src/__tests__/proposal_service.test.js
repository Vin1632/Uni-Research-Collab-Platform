
import { proposal_service, get_image_url  } from '../services/proposal_service';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
global.fetch = jest.fn();

describe('proposal_service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should call fetch with correct params and return data', async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await proposal_service("1", "Title", "Description", "http://img.com", "2024-01-01", "2024-12-31");

    expect(fetch).toHaveBeenCalledWith('/projects/project', expect.any(Object));
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    });

    await expect(proposal_service("1", "Title", "Description", "", "", "")).rejects.toThrow('Error occurred');
  });
});


jest.mock('firebase/storage', () => {
  return {
    ref: jest.fn(),
    uploadBytesResumable: jest.fn(),
    getDownloadURL: jest.fn(),
  };
});

describe('get_image_url', () => {
  const mockImage = new File(['dummy'], 'test.png', { type: 'image/png' });

  it('should return URL after successful upload', async () => {
    const mockSnapshot = {
      ref: {},
      bytesTransferred: 100,
      totalBytes: 100,
    };

    const mockUploadTask = {
      on: jest.fn((event, progress, error, success) => {
        progress(mockSnapshot);
        success();              
      }),
      snapshot: { ref: 'ref-path' },
    };

    uploadBytesResumable.mockReturnValue(mockUploadTask);
    getDownloadURL.mockResolvedValue('http://firebase/download-url');

    const result = await get_image_url(mockImage);
    expect(result).toBe('http://firebase/download-url');
  });

  it('should return empty string on error', async () => {
    uploadBytesResumable.mockImplementation(() => {
      throw new Error('Upload failed');
    });

    const result = await get_image_url(mockImage);
    expect(result).toBe('');
  });
});
