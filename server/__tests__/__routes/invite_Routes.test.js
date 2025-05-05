const request = require('supertest');
const express = require('express');
const router = require('../../Routes/Invite_Routes');
const db = require('../../db');
const nodemailer = require('nodemailer');

jest.mock('../../db');
jest.mock('nodemailer');

const app = express();
app.use(express.json());
app.use('/', router);

describe('POST /send-invite', () => {
  it('should return 400 for missing fields', async () => {
    const res = await request(app).post('/send-invite').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required fields');
  });

  it('should return 200 when email is sent successfully', async () => {
    const mockSendMail = jest.fn().mockResolvedValue();
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

    const res = await request(app).post('/send-invite').send({
      toEmail: 'test@example.com',
      fromUser: 'sender@example.com',
      projectTitle: 'AI Research',
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Invite sent successfully');
    expect(mockSendMail).toHaveBeenCalled();
  });

  it('should return 500 if nodemailer fails', async () => {
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockRejectedValue(new Error('SMTP error')),
    });

    const res = await request(app).post('/send-invite').send({
      toEmail: 'test@example.com',
      fromUser: 'sender@example.com',
      projectTitle: 'AI Research',
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Failed to send invite');
  });
});

describe('GET /accept-invite', () => {
  it('should return 400 if query params are missing', async () => {
    const res = await request(app).get('/accept-invite');
    expect(res.status).toBe(400);
    expect(res.text).toContain('Missing required parameters');
  });

  it('should accept invitation successfully', async () => {
    db.execute.mockImplementation((query, params) => {
      if (query.includes('FROM Users')) {
        return Promise.resolve([[{ user_id: 1 }]]);
      }
      if (query.includes('FROM Projects')) {
        return Promise.resolve([[{ project_id: 101 }]]);
      }
      return Promise.resolve();
    });

    const res = await request(app).get('/accept-invite')
      .query({ project: 'AI Research', sender: 'sender@example.com', recipient: 'test@example.com' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('successfully accepted');
  });

  it('should return 404 if user or project not found', async () => {
    db.execute.mockResolvedValue([[]]); // simulate empty result

    const res = await request(app).get('/accept-invite')
      .query({ project: 'AI Research', sender: 'sender@example.com', recipient: 'test@example.com' });

    expect(res.status).toBe(404);
    expect(res.text).toContain('not found');
  });
});

describe('GET /decline-invite', () => {
  it('should return 400 for missing query params', async () => {
    const res = await request(app).get('/decline-invite');
    expect(res.status).toBe(400);
    expect(res.text).toContain('Missing required parameters');
  });

  it('should decline invite successfully', async () => {
    db.execute.mockImplementation((query, params) => {
      if (query.includes('FROM Users')) return Promise.resolve([[{ user_id: 2 }]]);
      if (query.includes('FROM Projects')) return Promise.resolve([[{ project_id: 202 }]]);
      return Promise.resolve();
    });

    const res = await request(app).get('/decline-invite')
      .query({ project: 'AI Research', sender: 'sender@example.com', recipient: 'test@example.com' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('declined');
  });

  it('should return 404 if sender/recipient/project not found', async () => {
    db.execute.mockResolvedValue([[]]); // empty result

    const res = await request(app).get('/decline-invite')
      .query({ project: 'AI Research', sender: 'sender@example.com', recipient: 'test@example.com' });

    expect(res.status).toBe(404);
    expect(res.text).toContain('not found');
  });
});
