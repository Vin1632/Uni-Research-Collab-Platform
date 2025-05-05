const request = require('supertest');
const express = require('express');
const router = require('../../Routes/milestone_tracking_routes');
const milestoneController = require('../../controllers/milestone_tracking_controller');

const app = express();
app.use(express.json());
app.use('/', router);


jest.mock('../../controllers/milestone_tracking_controller');

describe('GET /projectdata/:id', () => {

    it('should return project data when valid ID is provided', async () => {
        const mockData = [{ id: 1, name: 'Project Alpha' }];
        milestoneController.get_users_projects.mockResolvedValue(mockData);

        const response = await request(app).get('/projectdata/123');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(milestoneController.get_users_projects).toHaveBeenCalledWith('123');
    });

    it('should return 500 if controller throws an error', async () => {
        milestoneController.get_users_projects.mockRejectedValue(new Error('DB Error'));

        const response = await request(app).get('/projectdata/123');

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'failed to fetch projects Data' });
    });
});
