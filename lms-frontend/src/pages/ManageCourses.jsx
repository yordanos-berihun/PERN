import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { coursesAPI } from '../services/api';

const PAGE_SIZE = 5;

export default function ManageCourses() {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    price: '0',
    published: true
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const ownedCourses = useMemo(() => {
    if (!user) return [];
    return courses.filter((course) => course.instructor?.id === user.id);
  }, [courses, user]);

  const pageCount = Math.max(Math.ceil(ownedCourses.length / PAGE_SIZE), 1);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return ownedCourses.slice(start, start + PAGE_SIZE);
  }, [ownedCourses, currentPage]);

  const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  async function fetchCourses() {
    setLoading(true);
    setMessage('');

    try {
      const res = await coursesAPI.getAll(1, 100);
      setCourses(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage('Unable to load courses.');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingCourse(null);
    setFormState({ title: '', description: '', price: '0', published: true });
  };

  const startEdit = (course) => {
    setEditingCourse(course);
    setFormState({
      title: course.title,
      description: course.description || '',
      price: course.price?.toString() || '0',
      published: course.published
    });
    setMessage('');
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isInstructor) {
      setMessage('You are not allowed to manage courses.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const payload = {
        title: formState.title,
        description: formState.description,
        price: Number(formState.price) || 0,
        published: formState.published
      };

      if (editingCourse) {
        await coursesAPI.update(editingCourse.id, payload);
        setMessage('Course updated.');
      } else {
        await coursesAPI.create(payload);
        setMessage('Course created.');
      }

      resetForm();
      fetchCourses();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to save course.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this course?')) return;

    setLoading(true);
    setMessage('');

    try {
      await coursesAPI.delete(id);
      setMessage('Course deleted.');
      fetchCourses();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to delete course.');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="manage-courses-page">
        <h2>Manage Courses</h2>
        <p>You must be logged in to manage courses.</p>
      </div>
    );
  }

  if (!isInstructor) {
    return (
      <div className="manage-courses-page">
        <h2>Manage Courses</h2>
        <p>Only instructors and admins can manage courses.</p>
      </div>
    );
  }

  return (
    <div className="manage-courses-page">
      <div className="manage-courses-header">
        <h2>Manage Courses</h2>
        <p>Use this page to create, edit, and remove your courses.</p>
      </div>

      {message && <div className="status-message">{message}</div>}

      <div className="manage-section">
        <div className="course-form-card">
          <h3>{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                placeholder="Course title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                placeholder="Course description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                value={formState.price}
                onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                min="0"
              />
            </div>
            <div className="form-group checkbox-group">
              <label htmlFor="published">
                <input
                  id="published"
                  type="checkbox"
                  checked={formState.published}
                  onChange={(e) => setFormState({ ...formState, published: e.target.checked })}
                />
                Published
              </label>
            </div>
            <div className="button-row">
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
              </button>
              {editingCourse && (
                <button type="button" className="auth-button secondary" onClick={resetForm} disabled={loading}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="course-table-card">
          <h3>My Courses</h3>
          {loading && <p>Loading courses...</p>}
          {!loading && paginatedCourses.length === 0 && <p>No courses found.</p>}

          <div className="courses-grid">
            {paginatedCourses.map((course) => (
              <div className="card" key={course.id}>
                <div className="course-card-header">
                  <h3>{course.title}</h3>
                  <span className="badge">{course.published ? 'Published' : 'Draft'}</span>
                </div>
                <p>{course.description || 'No description available.'}</p>
                <div className="course-meta">
                  <span>Price: ${course.price?.toFixed(2) ?? '0.00'}</span>
                </div>
                <div className="course-actions">
                  <button className="btn-secondary" onClick={() => startEdit(course)} disabled={loading}>
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(course.id)} disabled={loading}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {pageCount}</span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
