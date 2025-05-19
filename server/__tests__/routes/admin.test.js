const request = require('supertest');
const express = require('express');
const router = require('../../Routes/admin');
const db = require('../../db');
const {
  get_flagged_projects,
  delete_flag,
  delete_project,
} = require('../../controllers/flagged_projects');

jest.mock('../../db');
jest.mock('../../controllers/flagged_projects');

const app = express();
app.use(express.json());
app.use(router);

describe('Flagged Projects Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /flagged-projects', () => {
    it('should return all flagged projects', async () => {
      get_flagged_projects.mockResolvedValueOnce([[{ flag_id: 1, reason: 'Fake' }]]);
      const res = await request(app).get('/flagged-projects');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ flag_id: 1, reason: 'Fake' }]);
    });

    it('should handle DB errors', async () => {
      get_flagged_projects.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).get('/flagged-projects');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch flagged projects' });
    });
  });

  describe('DELETE /flagged-projects/:flagId', () => {
    it('should delete a flag and return success message', async () => {
      delete_flag.mockResolvedValueOnce([{ affectedRows: 1 }]);
      const res = await request(app).delete('/flagged-projects/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Flag deleted successfully' });
    });

    it('should return 404 if flag not found', async () => {
      delete_flag.mockResolvedValueOnce([{ affectedRows: 0 }]);
      const res = await request(app).delete('/flagged-projects/999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Flag not found' });
    });

    it('should handle deletion errors', async () => {
      delete_flag.mockRejectedValueOnce(new Error('Delete error'));
      const res = await request(app).delete('/flagged-projects/1');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to delete flag' });
    });
  });

  describe('DELETE /projects/:projectId', () => {
    it('should delete a project and return success message', async () => {
      delete_project.mockResolvedValueOnce([{ affectedRows: 1 }]);
      const res = await request(app).delete('/projects/5');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Project deleted successfully' });
    });

    it('should return 404 if project not found', async () => {
      delete_project.mockResolvedValueOnce([{ affectedRows: 0 }]);
      const res = await request(app).delete('/projects/999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Project not found' });
    });

    it('should handle project deletion error', async () => {
      delete_project.mockRejectedValueOnce(new Error('Delete failed'));
      const res = await request(app).delete('/projects/10');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to delete project' });
    });
  });

  describe('GET /projects/:projectId', () => {
    it('should return project details by ID', async () => {
      db.query.mockResolvedValueOnce([[{ project_id: 1, title: 'Test Project' }]]);
      const res = await request(app).get('/projects/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ project_id: 1, title: 'Test Project' });
    });

    it('should return 404 if project not found', async () => {
      db.query.mockResolvedValueOnce([[]]);
      const res = await request(app).get('/projects/999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Project not found' });
    });

    it('should handle DB error when fetching project details', async () => {
      db.query.mockRejectedValueOnce(new Error('Query failed'));
      const res = await request(app).get('/projects/1');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      db.query.mockResolvedValueOnce([[{ user_id: 1, email: 'test@example.com' }]]);
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ user_id: 1, email: 'test@example.com' }]);
    });

    it('should handle user fetch error', async () => {
      db.query.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).get('/users');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Failed to fetch users' });
    });
  });
});
