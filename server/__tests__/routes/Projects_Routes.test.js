const express = require('express');
const request = require('supertest');
const router = require('../../Routes/Projects_Routes');
const controllers = require('../../controllers/recommendation_projects');
const proposals = require('../../controllers/proposals');
const reviews = require('../../controllers/reviews');
const flagged = require('../../controllers/flagged_projects');

jest.mock('../../controllers/recommendation_projects');
jest.mock('../../controllers/proposals');
jest.mock('../../controllers/reviews');
jest.mock('../../controllers/flagged_projects');

const app = express();
app.use(express.json());
app.use(router);

describe('Projects Router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /recom-projects/:id', () => {
    it('should return recommended projects', async () => {
      const mockData = [{ id: 1, title: 'Project 1' }];
      controllers.get_recom_proj.mockResolvedValue(mockData);

      const res = await request(app).get('/recom-projects/123');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(controllers.get_recom_proj).toHaveBeenCalledWith('123');
    });

    it('should return 500 on error', async () => {
      controllers.get_recom_proj.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/recom-projects/123');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch projects' });
    });
  });

  describe('GET /projectdata/:id', () => {
    it('should return project data', async () => {
      const mockData = { id: 1, title: 'Data Project' };
      controllers.get_project_data.mockResolvedValue(mockData);

      const res = await request(app).get('/projectdata/456');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(controllers.get_project_data).toHaveBeenCalledWith('456');
    });

    it('should return 500 on error', async () => {
      controllers.get_project_data.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/projectdata/456');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'failed to fetch projects Data' });
    });
  });

  describe('POST /project', () => {
    const projectBody = {
      user_id: 'u1',
      title: 'New Project',
      description: 'desc',
      link_image: 'img.png',
      start_date: '2023-01-01',
      end_date: '2023-12-31'
    };

    it('should insert project and return data', async () => {
      proposals.insert_proposals.mockResolvedValue(projectBody);

      const res = await request(app).post('/project').send(projectBody);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(projectBody);
      expect(proposals.insert_proposals).toHaveBeenCalledWith(
        projectBody.user_id,
        projectBody.title,
        projectBody.description,
        projectBody.link_image,
        projectBody.start_date,
        projectBody.end_date
      );
    });

    it('should return 500 on error', async () => {
      proposals.insert_proposals.mockRejectedValue(new Error('fail'));

      const res = await request(app).post('/project').send(projectBody);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Failed to post project' });
    });
  });

  describe('POST /projectdata', () => {
    const projectDataBody = {
      project_id: 'p1',
      title: 'Project Data',
      requirements: 'Reqs',
      link_image: 'img.png',
      funds: 1000,
      funding_source: 'Source',
      start_date: '2023-01-01',
      end_date: '2023-12-31'
    };

    it('should insert project data and return data', async () => {
      proposals.insert_projectData.mockResolvedValue(projectDataBody);

      const res = await request(app).post('/projectdata').send(projectDataBody);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(projectDataBody);
      expect(proposals.insert_projectData).toHaveBeenCalledWith(
        projectDataBody.project_id,
        projectDataBody.title,
        projectDataBody.requirements,
        projectDataBody.link_image,
        projectDataBody.funds,
        projectDataBody.funding_source,
        projectDataBody.start_date,
        projectDataBody.end_date
      );
    });

    it('should return 500 on error', async () => {
      proposals.insert_projectData.mockRejectedValue(new Error('fail'));

      const res = await request(app).post('/projectdata').send(projectDataBody);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Failed to post project data' });
    });
  });

  describe('GET /active-projects', () => {
    it('should return active projects', async () => {
      const mockActive = [{ id: 'a1' }, { id: 'a2' }];
      reviews.get_active_projects.mockResolvedValue(mockActive);

      const res = await request(app).get('/active-projects');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockActive);
      expect(reviews.get_active_projects).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      reviews.get_active_projects.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/active-projects');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Failed to fetch active projects' });
    });
  });

  describe('POST /donate', () => {
    const donationBody = {
      reviewer_id: 'r1',
      project_id: 'p1',
      donated_amt: 100
    };

    it('should process donation successfully', async () => {
      reviews.donate_to_project.mockResolvedValue({ success: true });

      const res = await request(app).post('/donate').send(donationBody);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(reviews.donate_to_project).toHaveBeenCalledWith(donationBody);
    });

    it('should return 400 if missing fields', async () => {
      const res = await request(app).post('/donate').send({ reviewer_id: 'r1' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing required fields.' });
    });

    it('should return 500 on error', async () => {
      reviews.donate_to_project.mockRejectedValue(new Error('fail'));

      const res = await request(app).post('/donate').send(donationBody);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Failed to process donation.' });
    });
  });

  describe('GET /my-reviews/:reviewer_id', () => {
    it('should return reviewed projects', async () => {
      const mockReviews = [{ id: 1 }, { id: 2 }];
      reviews.get_reviewer_projects.mockResolvedValue(mockReviews);

      const res = await request(app).get('/my-reviews/abc');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockReviews);
      expect(reviews.get_reviewer_projects).toHaveBeenCalledWith('abc');
    });

    it('should return 500 on error', async () => {
      reviews.get_reviewer_projects.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/my-reviews/abc');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Failed to fetch reviewed projects' });
    });
  });

  describe('POST /flag-project', () => {
    const flagBody = {
      project_id: 'p1',
      flagged_by_user_id: 'u1',
      reason: 'spam',
      description: 'This project is spam'
    };

    it('should flag project successfully', async () => {
      flagged.flag_project.mockResolvedValue({ flag_id: 'f1' });

      const res = await request(app).post('/flag-project').send(flagBody);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Project flagged successfully', result: { flag_id: 'f1' } });
      expect(flagged.flag_project).toHaveBeenCalledWith(
        flagBody.project_id,
        flagBody.flagged_by_user_id,
        flagBody.reason,
        flagBody.description
      );
    });

    it('should return 500 on error', async () => {
      flagged.flag_project.mockRejectedValue(new Error('fail'));

      const res = await request(app).post('/flag-project').send(flagBody);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to flag project' });
    });
  });

  describe('GET /flagged-projects', () => {
    it('should return flagged projects', async () => {
      const flaggedProjects = [{ id: 'f1' }, { id: 'f2' }];
      flagged.get_flagged_projects.mockResolvedValue(flaggedProjects);

      const res = await request(app).get('/flagged-projects');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(flaggedProjects);
      expect(flagged.get_flagged_projects).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      flagged.get_flagged_projects.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/flagged-projects');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch flagged projects' });
    });
  });

  describe('DELETE /flagged-project/:flag_id', () => {
    it('should delete a flag', async () => {
      flagged.delete_flag.mockResolvedValue({ deleted: true });

      const res = await request(app).delete('/flagged-project/flag123');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Flag deleted/unflagged', result: { deleted: true } });
      expect(flagged.delete_flag).toHaveBeenCalledWith('flag123');
    });

    it('should return 500 on error', async () => {
      flagged.delete_flag.mockRejectedValue(new Error('fail'));

      const res = await request(app).delete('/flagged-project/flag123');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to delete flag' });
    });
  });
});
