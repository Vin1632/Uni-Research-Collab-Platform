const express = require('express');
const request = require('supertest');
const notificationRouter = require('../../Routes/notifications');

const notificationController = require('../../controllers/notification_controllers');

// Mock the controller functions
jest.mock('../../controllers/notification_controllers');

const app = express();
app.use(express.json());
app.use(notificationRouter);

describe('Notification Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /notification', () => {
    it('should return 400 if userId is missing', async () => {
      const res = await request(app).get('/notification');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing userId query parameter' });
    });

    it('should return notifications for a valid userId', async () => {
      const mockNotifs = [{ id: 1, message: 'You have been invited' }];
      notificationController.get_notifs.mockResolvedValueOnce(mockNotifs);

      const res = await request(app).get('/notification?userId=123');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockNotifs);
      expect(notificationController.get_notifs).toHaveBeenCalledWith('123');
    });

    it('should handle internal errors gracefully', async () => {
      notificationController.get_notifs.mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app).get('/notification?userId=123');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch notifications' });
    });
  });

  describe('GET /projects/:projectId', () => {
    it('should return project details if found', async () => {
      const mockProject = { project_id: 1, title: 'Test Project' };
      notificationController.get_project_by_id.mockResolvedValueOnce(mockProject);

      const res = await request(app).get('/projects/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProject);
      expect(notificationController.get_project_by_id).toHaveBeenCalledWith('1');
    });

    it('should return 404 if project not found', async () => {
      notificationController.get_project_by_id.mockResolvedValueOnce(null);

      const res = await request(app).get('/projects/999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Project not found' });
    });

    it('should handle errors when fetching project', async () => {
      notificationController.get_project_by_id.mockRejectedValueOnce(new Error('DB error'));

      const res = await request(app).get('/projects/1');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch project details' });
    });
  });

  describe('POST /respond', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/respond').send({ userId: 1 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing parameters' });
    });

    it('should process invitation successfully', async () => {
      const mockResponse = { success: true };
      notificationController.respond_to_invitation.mockResolvedValueOnce(mockResponse);

      const res = await request(app)
        .post('/respond')
        .send({ userId: 1, projectId: 2, action: 'accept' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
      expect(notificationController.respond_to_invitation).toHaveBeenCalledWith(1, 2, 'accept');
    });

    it('should handle errors in processing invitation', async () => {
      notificationController.respond_to_invitation.mockRejectedValueOnce(new Error('Error'));

      const res = await request(app)
        .post('/respond')
        .send({ userId: 1, projectId: 2, action: 'reject' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to process invitation' });
    });
  });
});
