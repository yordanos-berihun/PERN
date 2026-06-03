const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const validateCoursePayload = ({ title, description, price, published }) => {
  if (!title || String(title).trim().length < 3) {
    return 'Title is required and must be at least 3 characters long.';
  }

  if (description && String(description).trim().length > 1000) {
    return 'Description cannot exceed 1000 characters.';
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return 'Price must be a non-negative number.';
  }

  if (published !== undefined && typeof published !== 'boolean') {
    return 'Published must be a boolean value.';
  }

  return null;
};

// List all courses with optional pagination
const getAllCourses = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    const [total, courses] = await Promise.all([
      prisma.course.count(),
      prisma.course.findMany({
        skip: offset,
        take: limit,
        include: {
          instructor: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      success: true,
      data: courses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    });
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

    const enrollmentCount = await prisma.enrollment.count({ where: { courseId: id } });
    let enrolled = false;
    if (req.userId) {
      const existing = await prisma.enrollment.findFirst({ where: { userId: req.userId, courseId: id } });
      enrolled = !!existing;
    }

    res.json({ success: true, data: { ...course, enrollmentCount, enrolled } });
  } catch (error) {
    console.error('GetCourseById error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Get current instructor's courses
const getInstructorCourses = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    const where = { instructorId: req.userId };

    const [total, courses] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      success: true,
      data: courses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    });
  } catch (error) {
    console.error('GetInstructorCourses error:', error);
    res.status(500).json({ error: 'Failed to fetch instructor courses' });
  }
};

// Create a new course (authenticated)
const createCourse = async (req, res) => {
  try {
    const { title, description, price = 0, published = false } = req.body;
    const error = validateCoursePayload({ title, description, price, published });

    if (error) {
      return res.status(400).json({ error });
    }

    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only instructors and admins can create courses' });
    }

    const course = await prisma.course.create({
      data: {
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        price: Number(price),
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

    const payload = {
      title: title !== undefined ? title : course.title,
      description: description !== undefined ? description : course.description,
      price: price !== undefined ? price : course.price,
      published: published !== undefined ? published : course.published
    };

    const error = validateCoursePayload(payload);
    if (error) {
      return res.status(400).json({ error });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title: String(payload.title).trim(),
        description: payload.description ? String(payload.description).trim() : null,
        price: Number(payload.price),
        published: Boolean(payload.published)
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

  // Enroll the current user in a course
  const enrollCourse = async (req, res) => {
    try {
      const { id } = req.params;

      // Only logged-in users can enroll (role check can be adjusted)
      if (!req.user || !req.user.role) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const course = await prisma.course.findUnique({ where: { id } });
      if (!course) return res.status(404).json({ error: 'Course not found' });

      // Prevent enrolling twice
      const existing = await prisma.enrollment.findFirst({ where: { userId: req.userId, courseId: id } });
      if (existing) return res.status(400).json({ error: 'Already enrolled in this course' });

      const enrollment = await prisma.enrollment.create({
        data: { userId: req.userId, courseId: id }
      });

      res.status(201).json({ success: true, data: enrollment });
    } catch (error) {
      console.error('EnrollCourse error:', error);
      // Prisma unique constraint would also error here; map to user-friendly message
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Already enrolled in this course' });
      }
      res.status(500).json({ error: 'Failed to enroll in course' });
    }
  };

  // Get current user's enrolled courses
  const getEnrolledCourses = async (req, res) => {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
      const offset = (page - 1) * limit;

      const where = { userId: req.userId };

      const [total, enrollments] = await Promise.all([
        prisma.enrollment.count({ where }),
        prisma.enrollment.findMany({
          where,
          skip: offset,
          take: limit,
          include: { course: { include: { instructor: { select: { id: true, name: true, email: true } } } } },
          orderBy: { enrolledAt: 'desc' }
        })
      ]);

      const courses = enrollments.map((e) => e.course);

      res.json({
        success: true,
        data: courses,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.max(Math.ceil(total / limit), 1)
        }
      });
    } catch (error) {
      console.error('GetEnrolledCourses error:', error);
      res.status(500).json({ error: 'Failed to fetch enrolled courses' });
    }
  };

module.exports = {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses
};
