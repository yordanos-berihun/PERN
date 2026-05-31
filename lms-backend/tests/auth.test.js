const request = require('supertest');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const app = require('../app');

const prisma = new PrismaClient();
const randomEmail = () => `test-${Date.now()}@example.com`;

let token;
let userId;
let userEmail;

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: 'test-' } } });
  await prisma.$disconnect();
});

test('Register a new user successfully', async () => {
  userEmail = randomEmail();

  const response = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: userEmail, password: 'password123' })
    .expect(201);

  expect(response.body).toHaveProperty('success', true);
  expect(response.body.data).toHaveProperty('token');
  expect(response.body.data.user).toMatchObject({ name: 'Test User', email: userEmail });
  token = response.body.data.token;
  userId = response.body.data.user.id;
});

test('Login with registered user returns token', async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: userEmail, password: 'password123' })
    .expect(200);

  expect(loginResponse.body).toHaveProperty('success', true);
  expect(loginResponse.body.data).toHaveProperty('token');
});

test('Get profile with valid token', async () => {
  const response = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body).toHaveProperty('success', true);
  expect(response.body.data.user).toMatchObject({ id: userId, email: userEmail });
});

test('Update profile name and email successfully', async () => {
  const newEmail = randomEmail();
  const response = await request(app)
    .put('/api/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Updated User', email: newEmail })
    .expect(200);

  expect(response.body).toHaveProperty('success', true);
  expect(response.body.data.user).toMatchObject({ name: 'Updated User', email: newEmail });
});

test('Update password requires current password', async () => {
  const response = await request(app)
    .put('/api/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .send({ password: 'newpassword123' })
    .expect(400);

  expect(response.body).toHaveProperty('error', 'Current password is required to change your password');
});

test('Update password with wrong current password fails', async () => {
  await request(app)
    .put('/api/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .send({ currentPassword: 'wrongpass', password: 'newpassword123' })
    .expect(401);
});

test('Update profile without auth returns 401', async () => {
  await request(app)
    .put('/api/auth/me')
    .send({ name: 'No Auth' })
    .expect(401);
});

test('Auth middleware rejects malformed authorization header', async () => {
  const response = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Token ${token}`)
    .expect(401);

  expect(response.body).toHaveProperty('error', 'Invalid authorization header format.');
});

test('Auth middleware rejects expired token', async () => {
  const expiredToken = jwt.sign(
    { sub: userId, email: userEmail, role: 'STUDENT' },
    process.env.JWT_SECRET,
    { expiresIn: '-1s' }
  );

  const response = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${expiredToken}`)
    .expect(401);

  expect(response.body).toHaveProperty('error', 'Token expired.');
});
