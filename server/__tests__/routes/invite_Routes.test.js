const request = require('supertest');
const express = require('express');
const router = require('../../Routes/Invite_Routes');
const nodemailer = require('nodemailer');
const {
  insert_invitations,
  get_email_project_id,
} = require('../../controllers/invite_collab_controllers');

jest.mock('nodemailer');
jest.mock('../../controllers/invite_collab_controllers');

const app = express();
app.use(express.json());
app.use(router);

describe('Invite Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /send-invite', () => {
    const sampleBody = {
      toEmail: 'collaborator@example.com',
      fromUser: 'researcher@example.com',
      projectTitle: 'AI for Climate Change',
    };

    it('should send an email and insert invitation successfully', async () => {
      const sendMailMock = jest.fn().mockResolvedValue({});
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
      insert_invitations.mockResolvedValueOnce();

      const res = await request(app).post('/send-invite').send(sampleBody);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Invite sent successfully' });
      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(insert_invitations).toHaveBeenCalledWith(
        sampleBody.toEmail,
        sampleBody.fromUser,
        sampleBody.projectTitle
      );
    });

    it('should handle errors during email sending', async () => {
      const sendMailMock = jest.fn().mockRejectedValue(new Error('Mail failed'));
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

      const res = await request(app).post('/send-invite').send(sampleBody);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Failed to send invite' });
      expect(sendMailMock).toHaveBeenCalled();
      expect(insert_invitations).not.toHaveBeenCalled();
    });
  });

  describe('GET /send-invite/:id', () => {
    it('should return email by project ID', async () => {
      get_email_project_id.mockResolvedValueOnce([{ email: 'someuser@example.com' }]);
      const res = await request(app).get('/send-invite/123');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ result: [{ email: 'someuser@example.com' }] });
      expect(get_email_project_id).toHaveBeenCalledWith('123');
    });

    it('should handle database error when fetching email', async () => {
      get_email_project_id.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).get('/send-invite/123');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Failed To Fetch the email' });
    });
  });
});
