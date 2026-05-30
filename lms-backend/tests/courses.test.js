const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../app');

const prisma = new PrismaClient();
const randomEmail = () => `course-test-${Date.now()}@example.com`;

let instructorToken;
let courseId;

beforeAll(async () => {
  await prisma.$connect();
  const email = randomEmail();
  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Instructor Test', email, password: 'password123', role: 'INSTRUCTOR' })
    .expect(201);

  instructorToken = registerResponse.body.data.token;
});

afterAll(async () => {
  await prisma.course.deleteMany({ where: { title: { contains: 'Test Course' } } });
  await prisma.user.deleteMany({ where: { email: { contains: 'course-test-' } } });
  await prisma.$disconnect();
});

test('List courses returns success and array', async () => {
  const response = await request(app)
    .get('/api/courses')
    .expect(200);

  expect(response.body).toHaveProperty('success', true);
  expect(Array.isArray(response.body.data)).toBe(true);
});

test('Create course is protected and works for instructor role', async () => {
  const response = await request(app)
    .post('/api/courses')
    .set('Authorization', `Bearer ${instructorToken}`)
    .send({ title: 'Test Course 1', description: 'Course for tests', price: 9.99, published: true })
    .expect(201);

  expect(response.body).toHaveProperty('success', true);
  expect(response.body.data).toHaveProperty('title', 'Test Course 1');
  courseId = response.body.data.id;
});

test('Instructor can query their own courses', async () => {
  const response = await request(app)
    .get('/api/courses/mine')
    .set('Authorization', `Bearer ${instructorToken}`)
    .expect(200);

  expect(response.body).toHaveProperty('success', true);
  expect(Array.isArray(response.body.data)).toBe(true);
  expect(response.body.meta).toHaveProperty('page', 1);
  expect(response.body.meta).toHaveProperty('limit', 10);
  expect(response.body.data.some((course) => course.id === courseId)).toBe(true);
});

test('Create course without auth returns 401', async () => {
  await request(app)
    .post('/api/courses')
    .send({ title: 'Test Course 2', description: 'No auth', price: 9.99 })
    .expect(401);
});

test('Create course rejects invalid title', async () => {
  const response = await request(app)
    .post('/api/courses')
    .set('Authorization', `Bearer ${instructorToken}`)
    .send({ title: 'Hi', description: 'Too short title', price: 9.99, published: true })
    .expect(400);

  expect(response.body).toHaveProperty('error', 'Title is required and must be at least 3 characters long.');
});

test('Update course is allowed for owner instructor', async () => {
  const response = await request(app)
    .put(`/api/courses/${courseId}`)
    .set('Authorization', `Bearer ${instructorToken}`)
    .send({ title: 'Test Course 1 Updated' })
    .expect(200);

  expect(response.body).toHaveProperty('success', true);
  expect(response.body.data).toHaveProperty('title', 'Test Course 1 Updated');
});

test('Update course rejects invalid payload', async () => {
  const response = await request(app)
    .put(`/api/courses/${courseId}`)
    .set('Authorization', `Bearer ${instructorToken}`)
    .send({ price: -5 })
    .expect(400);

  expect(response.body).toHaveProperty('error', 'Price must be a non-negative number.');
});

test('Delete course is allowed for owner instructor', async () => {
  await request(app)
    .delete(`/api/courses/${courseId}`)
    .set('Authorization', `Bearer ${instructorToken}`)
    .expect(200);
});
