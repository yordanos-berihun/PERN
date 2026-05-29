const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// List all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('GetAllCourses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get course by id
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: { instructor: { select: { id: true, name: true, email: true } } }
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });

    res.json({ success: true, data: course });
  } catch (error) {
    console.error('GetCourseById error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Create a new course (authenticated)
const createCourse = async (req, res) => {
  try {
    const { title, description, price = 0, published = false } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title is required (min 3 chars)' });
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description || null,
        price: Number(price) || 0,
        published: Boolean(published),
        instructorId: req.userId
      }
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error('CreateCourse error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Update a course (only instructor or admin)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, published } = req.body;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Allow only the instructor who created it or an ADMIN
    if (course.instructorId !== req.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title: title ? title.trim() : course.title,
        description: description !== undefined ? description : course.description,
        price: price !== undefined ? Number(price) : course.price,
        published: published !== undefined ? Boolean(published) : course.published
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('UpdateCourse error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete a course (only instructor or admin)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.instructorId !== req.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await prisma.course.delete({ where: { id } });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('DeleteCourse error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
