const request = require('supertest');
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
