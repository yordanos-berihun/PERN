const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllCourses,
  getCourseById,  getInstructorCourses,  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

// Public
router.get('/', getAllCourses);
router.get('/mine', auth, getInstructorCourses);
router.get('/:id', getCourseById);

// Protected
router.post('/', auth, createCourse);
router.put('/:id', auth, updateCourse);
router.delete('/:id', auth, deleteCourse);

module.exports = router;
