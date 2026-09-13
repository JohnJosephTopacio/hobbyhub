import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('POST /auth/register', () => {
  it('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'jackshephard@email.com', username: 'manofscience', password: 'Password1' });

    expect(res.status).toBe(201);
  });

  it('prevents duplicate user account creation', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'jackshephard@email.com', username: 'manofscience', password: 'Password1' });

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'jackshephard@email.com', username: 'manofscience', password: 'Password1' });

    expect(res.status).toBe(409);
  });
});

describe('POST /auth/login', () => {
  it('logins a user sucessfully', async () => {
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ email: 'jackshephard@email.com', username: 'manofscience', password: 'Password1' });
    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'jackshephard@email.com', password: 'Password1' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('accessToken');
  });

  it('throws an error on non-existent email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'jackshephard@email.com', password: 'Password1' });

    expect(res.status).toBe(404);
  });

  it('throws an error on incorrect password', async () => {
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ email: 'jackshephard@email.com', username: 'manofscience', password: 'Password1' });
    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'jackshephard@email.com', password: 'NotThePassword' });

    expect(loginRes.status).toBe(401);
  });
});
