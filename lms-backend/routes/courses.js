const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');

// Get all published courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ published: true }).populate('author', 'name email');
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create course (instructor/admin)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, lessons, published } = req.body;
    const course = new Course({ title, description, lessons, published, author: req.user.id });
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get course by id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('author', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

