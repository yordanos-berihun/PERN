const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123', 12);

  console.log('Seeding database...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password,
      role: 'ADMIN'
    }
  });

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      name: 'Instructor User',
      email: 'instructor@example.com',
      password,
      role: 'INSTRUCTOR'
    }
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      name: 'Student User',
      email: 'student@example.com',
      password,
      role: 'STUDENT'
    }
  });

  const firstCourse = await prisma.course.findFirst({
    where: { title: 'Intro to React' }
  });

  if (!firstCourse) {
    await prisma.course.create({
      data: {
        title: 'Intro to React',
        description: 'Learn the fundamentals of React, hooks, state management, and component design.',
        price: 99,
        published: true,
        instructorId: instructor.id
      }
    });
  }

  const secondCourse = await prisma.course.findFirst({
    where: { title: 'Advanced Node.js' }
  });

  if (!secondCourse) {
    await prisma.course.create({
      data: {
        title: 'Advanced Node.js',
        description: 'Build scalable APIs with Express, authentication, and deployment best practices.',
        price: 149,
        published: true,
        instructorId: instructor.id
      }
    });
  }


  console.log('Seeding complete.');
  console.log('Admin login: admin@example.com / Password123');
  console.log('Instructor login: instructor@example.com / Password123');
  console.log('Student login: student@example.com / Password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
