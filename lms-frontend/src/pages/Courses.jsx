import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';

const DEFAULT_PAGE_SIZE = 10;
import useAuthStore from '../store/authStore';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ page: 1, limit: DEFAULT_PAGE_SIZE, total: 0, totalPages: 1 });
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
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

  const DEBOUNCE_MS = 400;

  useEffect(() => {
    fetchCourses(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchQuery]);

  // Debounce search input -> update searchQuery after a delay
  useEffect(() => {
    if (searchInput.trim() === searchQuery) {
      return undefined;
    }

    setSearchLoading(true);
    const timer = setTimeout(() => {
      const q = searchInput?.trim() || '';
      setSearchQuery(q);
      setCurrentPage(1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

  async function fetchCourses(page = 1) {
    try {
      const res = await coursesAPI.getAll(page, pageSize, searchQuery);
      setCourses(res.data.data || []);
      if (res.data.meta) {
        setPageMeta(res.data.meta);
        setCurrentPage(res.data.meta.page || page);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to load courses.');
    } finally {
      setSearchLoading(false);
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
      fetchCourses(currentPage);
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
      // refresh current page after delete
      fetchCourses(currentPage);
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
      // optionally refresh enrollment state or course list
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to enroll.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h2>Courses</h2>
          <p>Browse available courses below. Instructors can add and manage their own courses.</p>
        </div>
        <div className="page-summary">{pageMeta.total ?? 0} courses available</div>
      </div>
      <div className="courses-controls">
        <div className="search-control">
          <input
            className="search-input"
            placeholder="Search courses by title or description"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setSearchLoading(true);
                setSearchQuery(searchInput.trim());
                setCurrentPage(1);
              }

              if (e.key === 'Escape') {
                e.preventDefault();
                setSearchInput('');
                setSearchLoading(true);
                setSearchQuery('');
                setCurrentPage(1);
              }
            }}
            aria-label="Search courses"
          />
          <button onClick={() => { setSearchLoading(true); setSearchQuery(searchInput.trim()); setCurrentPage(1); }}>Search</button>
          <button onClick={() => { setSearchLoading(true); setSearchInput(''); setSearchQuery(''); setCurrentPage(1); }}>Clear</button>
          {searchLoading && <span className="search-loading">Searching...</span>}
          <p className="search-hint">Press Enter to search, Escape to clear the field.</p>
        </div>

        <div className="page-size-control">
          <label>Page size:</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      {message && <div className="status-message">{message}</div>}

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
              <div className="card" key={course.id}>
                <div className="course-card-header">
                  <h3>
                    <Link to={`/courses/${course.id}`}>{course.title}</Link>
                  </h3>
                  {isOwner && <span className="badge">Your course</span>}
                </div>
                <p>{course.description || 'No description yet.'}</p>
                <div className="course-meta">
                  <span>Instructor: {course.instructor?.name || course.instructor?.email}</span>
                  <span>Price: ${course.price?.toFixed(2) ?? '0.00'}</span>
                </div>
                <div className="course-actions">
                  {isOwner && (
                    <>
                      <button className="btn-secondary" onClick={() => startEdit(course)} disabled={loading}>
                        Edit
                      </button>
                      <button className="btn-danger" onClick={() => handleDeleteCourse(course.id)} disabled={loading}>
                        Delete
                      </button>
                    </>
                  )}
                  {!isOwner && user && (
                    <button className="btn-primary" onClick={() => handleEnrollCourse(course.id)} disabled={loading}>
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Pagination controls */}
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {pageMeta.page} of {Math.max(pageMeta.totalPages, 1)}
        </span>
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.max(pageMeta.totalPages, 1)))}
          disabled={currentPage >= Math.max(pageMeta.totalPages, 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
