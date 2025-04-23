const request = require('supertest');
const express = require('express');
const routes = require('../../Routes/Projects_Routes');


jest.mock('../../controllers/recommendation_projects', () => ({
  get_recom_proj: jest.fn().mockResolvedValue([{ id: 1, title: "Project A" }]),
  get_project_data: jest.fn().mockResolvedValue([{ id: 1, detail: "Data A" }]),
}));

jest.mock('../../controllers/proposals', () => ({
  insert_proposals: jest.fn().mockResolvedValue({ success: true }),
  get_project_id: jest.fn().mockResolvedValue({ id: 1 }),
  insert_projectData: jest.fn().mockResolvedValue({ success: true }),
}));

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Recommendation Routes', () => {

  test('GET /recom-projects/:id should return project recommendations', async () => {
    const res = await request(app).get('/recom-projects/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, title: "Project A" }]);
  });

  test('GET /projectdata/:id should return project data', async () => {
    const res = await request(app).get('/projectdata/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, detail: "Data A" }]);
  });

  test('POST /project should insert a new project', async () => {
    const res = await request(app)
      .post('/project')
      .send({ user_id: 1, title: 'New Project', description: 'Cool idea', link_image: 'image.jpg' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /projectdata should insert project details', async () => {
    const res = await request(app)
      .post('/projectdata')
      .send({ project_id: 1, title: 'Details', requirements: 'reqs', link_image: 'img.png', funding: 5000, funding_source: 'donor' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /project_id/:id should return a project ID', async () => {
    const res = await request(app).get('/project_id/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1 });
  });

});
