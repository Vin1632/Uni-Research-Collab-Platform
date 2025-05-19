const express = require('express');
const request = require('supertest');
const profileRouter = require('../../Routes/profile_route'); 
const profileController = require('../../controllers/profile_controller');

jest.mock('../../controllers/profile_controller');

const app = express();
app.use(express.json());
app.use(profileRouter);

describe('Profile Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /profile', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app).get('/profile');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Email is required' });
    });

    it('should return 404 if user not found', async () => {
      profileController.getProfile.mockResolvedValueOnce(null);
      const res = await request(app).get('/profile?email=test@example.com');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'User not found' });
      expect(profileController.getProfile).toHaveBeenCalledWith('test@example.com');
    });

    it('should return user profile for valid email', async () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        institution: 'Test Institute',
        qualification: 'PhD',
        interests: ['AI', 'ML'],
      };
      profileController.getProfile.mockResolvedValueOnce(mockUser);

      const res = await request(app).get('/profile?email=test@example.com');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 500 on server error', async () => {
      profileController.getProfile.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/profile?email=test@example.com');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('PUT /profile', () => {
    const validBody = {
      email: 'test@example.com',
      name: 'Updated Name',
      institution: 'Updated Institute',
      qualification: 'MSc',
      interests: ['Blockchain'],
    };

    it('should return 400 if email is missing in body', async () => {
      const res = await request(app).put('/profile').send({ name: 'No Email' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Email is required' });
    });

    it('should update profile successfully', async () => {
      profileController.updateProfile.mockResolvedValueOnce();
      const res = await request(app).put('/profile').send(validBody);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Profile updated successfully' });
      expect(profileController.updateProfile).toHaveBeenCalledWith(validBody);
    });

    it('should return 500 if update fails', async () => {
      profileController.updateProfile.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).put('/profile').send(validBody);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });
});
