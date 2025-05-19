const express = require('express');
const request = require('supertest');
const userRouter = require('../../Routes/Users_Routes');
const userController = require('../../controllers/Users');

jest.mock('../../controllers/Users');

const app = express();
app.use(express.json());
app.use(userRouter);

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /user', () => {
    it('should return user data for a valid email', async () => {
      const mockEmail = { email: 'test@example.com' };
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

      userController.get_User_By_Email.mockResolvedValueOnce(mockUser);

      const res = await request(app).post('/user').send(mockEmail);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
      expect(userController.get_User_By_Email).toHaveBeenCalledWith(mockEmail);
    });

    it('should return 500 if get_User_By_Email fails', async () => {
      userController.get_User_By_Email.mockRejectedValueOnce(new Error('DB error'));

      const res = await request(app).post('/user').send({ email: 'test@example.com' });
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch data (User)' });
    });
  });

  describe('POST /login', () => {
    const validBody = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'researcher',
      institution: 'University',
      qualification: 'PhD',
      interests: ['AI', 'ML'],
    };

    it('should insert a user and return success', async () => {
      userController.insert_Users.mockResolvedValueOnce();

      const res = await request(app).post('/login').send(validBody);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'User Added Successfully' });
      expect(userController.insert_Users).toHaveBeenCalledWith(
        validBody.name,
        validBody.email,
        validBody.role,
        validBody.institution,
        validBody.qualification,
        validBody.interests
      );
    });

    it('should return 500 if insert_Users fails', async () => {
      userController.insert_Users.mockRejectedValueOnce(new Error('Insert failed'));

      const res = await request(app).post('/login').send(validBody);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to add a User' });
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'A', email: 'a@example.com' },
        { id: 2, name: 'B', email: 'b@example.com' }
      ];

      userController.get_all_users.mockResolvedValueOnce(mockUsers);

      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
      expect(userController.get_all_users).toHaveBeenCalled();
    });

    it('should return 500 if get_all_users fails', async () => {
      userController.get_all_users.mockRejectedValueOnce(new Error('DB error'));

      const res = await request(app).get('/users');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch users' });
    });
  });
});
