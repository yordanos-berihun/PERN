require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');

async function main(){
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', uri);

  await User.deleteMany({});
  await Course.deleteMany({});

  const password = await bcrypt.hash('password123', 10);
  const instructor = new User({ name: 'Instructor One', email: 'instructor@example.com', password, role: 'instructor' });
  const student = new User({ name: 'Student One', email: 'student@example.com', password, role: 'student' });
  await instructor.save();
  await student.save();

  const c1 = new Course({
    title: 'Intro to MERN',
    description: 'Basics of the MERN stack',
    author: instructor._id,
    published: true,
    lessons: [
      { title: 'Setup', content: 'Install Node, Mongo, and run server', order: 1 },
      { title: 'First App', content: 'Create a simple CRUD app', order: 2 }
    ]
  });
  await c1.save();

  console.log('Seed complete.');
  console.log('Instructor:', 'instructor@example.com / password123');
  console.log('Student:', 'student@example.com / password123');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
