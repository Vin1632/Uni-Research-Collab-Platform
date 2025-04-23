const request = require('supertest');
const express = require('express');
const userRoutes = require('../../Routes/Users_Routes'); 

jest.mock('../../controllers/Users', () => ({
    get_User_By_Email: jest.fn(),
    insert_Users: jest.fn(),
}));

const { get_User_By_Email, insert_Users } = require('../../controllers/Users');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {

    describe('POST /users/user', () => {
        it('should return user data if found', async () => {
            const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
            get_User_By_Email.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/users/user')
                .send({ email: 'john@example.com' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockUser);
            expect(get_User_By_Email).toHaveBeenCalledWith({ email: 'john@example.com' });
        });

        it('should handle errors and return 500', async () => {
            get_User_By_Email.mockRejectedValue(new Error('DB Error'));

            const res = await request(app)
                .post('/users/user')
                .send({ email: 'error@example.com' });

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch data (User)' });
        });
    });

    describe('POST /users/login', () => {
        it('should add a user and return success message', async () => {
            insert_Users.mockResolvedValue();

            const user = {
                name: 'Alice',
                email: 'alice@example.com',
                role: 'student',
                institution: 'Test University',
                qualification: 'BSc',
                interests: ['AI', 'Robotics']
            };

            const res = await request(app)
                .post('/users/login')
                .send(user);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'User Added Successfully' });
            expect(insert_Users).toHaveBeenCalledWith(
                user.name,
                user.email,
                user.role,
                user.institution,
                user.qualification,
                user.interests
            );
        });

        it('should handle insert errors and return 500', async () => {
            insert_Users.mockRejectedValue(new Error('Insert failed'));

            const res = await request(app)
                .post('/users/login')
                .send({
                    name: 'Bob',
                    email: 'bob@example.com',
                    role: 'mentor',
                    institution: 'Another School',
                    qualification: 'MSc',
                    interests: ['Math']
                });

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to add a User' });
        });
    });
});
