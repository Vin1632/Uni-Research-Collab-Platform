const express = require('express');
const request = require('supertest');
const router = require('../../Routes/milestone_tracking_routes');
const { get_users_projects } = require('../../controllers/milestone_tracking_controller');

jest.mock('../../controllers/milestone_tracking_controller');

const app = express();
app.use(express.json());
app.use(router);

describe('GET /projectdata/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return project data for the given user ID', async () => {
    const mockData = [
      { project_id: 1, title: 'Project A' },
      { project_id: 2, title: 'Project B' },
    ];

    get_users_projects.mockResolvedValueOnce(mockData);

    const res = await request(app).get('/projectdata/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
    expect(get_users_projects).toHaveBeenCalledWith('123');
  });

  it('should return 500 if get_users_projects throws an error', async () => {
    get_users_projects.mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app).get('/projectdata/123');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'failed to fetch projects Data' });
    expect(get_users_projects).toHaveBeenCalledWith('123');
  });
});
