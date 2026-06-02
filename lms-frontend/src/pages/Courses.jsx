import React, { useEffect, useState } from 'react';
import { coursesAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [published, setPublished] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editPublished, setEditPublished] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await coursesAPI.getAll();
      setCourses(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load courses.');
    }
  }

  async function handleCreateCourse(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await coursesAPI.create({
        title,
        description,
        price: Number(price) || 0,
        published
      });
      setTitle('');
      setDescription('');
      setPrice('');
      setPublished(true);
      setMessage('Course created successfully.');
      fetchCourses();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to create course.');
    } finally {
      setLoading(false);
    }
  }

  const startEdit = (course) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditDescription(course.description || '');
    setEditPrice(course.price?.toString() || '0');
    setEditPublished(course.published);
    setMessage('');
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setEditTitle('');
    setEditDescription('');
    setEditPrice('');
    setEditPublished(true);
  };

  async function handleUpdateCourse(e) {
    e.preventDefault();
    if (!editingCourse) return;

    setLoading(true);
    setMessage('');

    try {
      await coursesAPI.update(editingCourse.id, {
        title: editTitle,
        description: editDescription,
        price: Number(editPrice) || 0,
        published: editPublished
      });
      setMessage('Course updated successfully.');
      cancelEdit();
      fetchCourses();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to update course.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCourse(courseId) {
    if (!window.confirm('Delete this course? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await coursesAPI.delete(courseId);
      setMessage('Course deleted successfully.');
      fetchCourses();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to delete course.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnrollCourse(courseId) {
    if (!user) {
      setMessage('You must be logged in to enroll.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await coursesAPI.enroll(courseId);
      setMessage('Enrolled successfully.');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to enroll.');
    } finally {
      setLoading(false);
    }
  }

  const isSuccess = message.toLowerCase().includes('success');
  const isError = message && !isSuccess;

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h2>Courses</h2>
          <p>Browse available courses below. Instructors can add and manage their own courses.</p>
        </div>
      </div>

      {message && (
        <div className={`status-message ${isSuccess ? 'success' : isError ? 'error' : ''}`}>
          {message}
        </div>
      )}

      {isInstructor && (
        <div className="course-form-card">
          <h3>{editingCourse ? 'Edit course' : 'Create a new course'}</h3>
          <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse} className="auth-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={editingCourse ? editTitle : title}
                onChange={(e) => editingCourse ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                placeholder="Course title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={editingCourse ? editDescription : description}
                onChange={(e) => editingCourse ? setEditDescription(e.target.value) : setDescription(e.target.value)}
                placeholder="Course description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                value={editingCourse ? editPrice : price}
                onChange={(e) => editingCourse ? setEditPrice(e.target.value) : setPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="form-group checkbox-group">
              <label htmlFor="published">
                <input
                  id="published"
                  type="checkbox"
                  checked={editingCourse ? editPublished : published}
                  onChange={(e) => editingCourse ? setEditPublished(e.target.checked) : setPublished(e.target.checked)}
                />
                Published
              </label>
            </div>
            <div className="button-row">
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
              </button>
              {editingCourse && (
                <button type="button" className="auth-button secondary" onClick={cancelEdit} disabled={loading}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => {
            const isOwner = course.instructor?.id === user?.id;
            return (
              <CourseCard
                key={course.id}
                course={course}
                variant="browse"
                isOwner={isOwner}
                onEdit={startEdit}
                onDelete={handleDeleteCourse}
                onEnroll={handleEnrollCourse}
                loading={loading}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
