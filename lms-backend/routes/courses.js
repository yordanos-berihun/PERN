const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { optionalAuth, requireRole } = require('../middleware/auth');
const {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses
} = require('../controllers/courseController');

// Public
router.get('/', getAllCourses);
router.get('/mine', auth, requireRole('INSTRUCTOR', 'ADMIN'), getInstructorCourses);
router.get('/enrolled', auth, getEnrolledCourses);
router.get('/:id', optionalAuth, getCourseById);

// Protected
router.post('/', auth, requireRole('INSTRUCTOR', 'ADMIN'), createCourse);
router.post('/:id/enroll', auth, enrollCourse);
router.put('/:id', auth, updateCourse);
router.delete('/:id', auth, deleteCourse);

module.exports = router;
