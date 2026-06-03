import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { coursesAPI } from '../services/api';
import CourseCard from '../components/CourseCard';

const PAGE_SIZE = 6;
const DEBOUNCE_MS = 400;

export default function ManageCourses() {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [editingCourse, setEditingCourse] = useState(null);
  const [formState, setFormState] = useState({ title: '', description: '', price: '0', published: true });

  const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  useEffect(() => {
    if (isInstructor) fetchCourses(currentPage);
  }, [currentPage, isInstructor]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter(
      (c) => c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
    );
  }, [courses, searchQuery]);

  const pageCount = Math.max(pageMeta.totalPages, 1);

  async function fetchCourses(page = 1) {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await coursesAPI.getMine(page, PAGE_SIZE);
      setCourses(res.data.data || []);
      if (res.data.meta) setPageMeta(res.data.meta);
      setCurrentPage(res.data.meta?.page || page);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Unable to load courses.', type: 'error' });
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
    setMessage({ text: '', type: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const payload = {
        title: formState.title,
        description: formState.description,
        price: Number(formState.price) || 0,
        published: formState.published
      };
      if (editingCourse) {
        await coursesAPI.update(editingCourse.id, payload);
        setMessage({ text: 'Course updated successfully.', type: 'success' });
      } else {
        await coursesAPI.create(payload);
        setMessage({ text: 'Course created successfully.', type: 'success' });
      }
      resetForm();
      fetchCourses(1);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Unable to save course.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await coursesAPI.delete(id);
      setMessage({ text: 'Course deleted.', type: 'success' });
      fetchCourses(currentPage);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Unable to delete course.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated || !isInstructor) {
    return (
      <div className="manage-courses-page">
        <div className="empty-state">
          <span className="empty-icon">🔒</span>
          <p>{!isAuthenticated ? 'You must be logged in.' : 'Only instructors and admins can manage courses.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-courses-page">
      <div className="manage-courses-header">
        <h2>Manage Courses</h2>
        <p>Create, edit, and remove your courses.</p>
      </div>

      {message.text && (
        <div className={`status-message ${message.type}`}>{message.text}</div>
      )}

      <div className="manage-section">
        <div className="course-form-card">
          <h3>{editingCourse ? `Editing: ${editingCourse.title}` : 'Create New Course'}</h3>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="mc-title">Title</label>
              <input
                id="mc-title"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                placeholder="Course title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mc-description">Description</label>
              <textarea
                id="mc-description"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                placeholder="What will students learn?"
              />
            </div>
            <div className="form-group">
              <label htmlFor="mc-price">Price (USD)</label>
              <input
                id="mc-price"
                type="number"
                value={formState.price}
                onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                min="0"
                step="0.01"
                placeholder="0 for free"
              />
            </div>
            <div className="form-group checkbox-group">
              <label htmlFor="mc-published">
                <input
                  id="mc-published"
                  type="checkbox"
                  checked={formState.published}
                  onChange={(e) => setFormState({ ...formState, published: e.target.checked })}
                />
                Publish immediately
              </label>
            </div>
            <div className="button-row">
              <button type="submit" className="btn btn-md btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
              </button>
              {editingCourse && (
                <button type="button" className="btn btn-md btn-secondary" onClick={resetForm} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="course-table-card">
          <div className="course-table-header">
            <h3>My Courses</h3>
            <span className="page-summary">{pageMeta.total} total</span>
          </div>
          <div className="courses-controls">
            <input
              className="search-input"
              type="search"
              placeholder="Filter courses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-inline">
              <div className="loading-spinner loading-sm" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="empty-state empty-state-sm">
              <p>{searchInput ? `No courses match "${searchInput}"` : "You haven't created any courses yet."}</p>
            </div>
          ) : (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant="manage"
                  onEdit={startEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span className="pagination-info">Page {currentPage} of {pageCount}</span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
                disabled={currentPage === pageCount}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
