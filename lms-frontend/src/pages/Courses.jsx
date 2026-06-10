import React, { useEffect, useState } from 'react';
import { coursesAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import CourseCard from '../components/CourseCard';

const PAGE_SIZE = 9;
const DEBOUNCE_MS = 400;

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchCourses(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchCourses(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  async function fetchCourses(page = 1) {
    setLoading(true);
    setMessage('');
    try {
      const res = await coursesAPI.getAll(page, PAGE_SIZE);
      let data = res.data.data || [];
      const q = searchInput.trim().toLowerCase();
      if (q) {
        data = data.filter(
          (c) => c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
        );
      }
      setCourses(data);
      if (res.data.meta) setPageMeta(res.data.meta);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to load courses.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll(courseId) {
    if (!user) {
      setMessage('You must be logged in to enroll.');
      setMessageType('info');
      return;
    }
    try {
      await coursesAPI.enroll(courseId);
      setMessage('Enrolled successfully!');
      setMessageType('success');
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, enrolled: true } : c))
      );
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to enroll.');
      setMessageType('error');
    }
  }

  const pageCount = Math.max(pageMeta.totalPages, 1);

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h2>All Courses</h2>
          <p className="page-summary">
            {pageMeta.total > 0
              ? `${pageMeta.total} course${pageMeta.total !== 1 ? 's' : ''} available`
              : 'Discover something new'}
          </p>
        </div>
      </div>

      <div className="search-control">
        <input
          type="search"
          className="search-input"
          placeholder="Search by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {message && (
        <div className={`status-message ${messageType}`}>{message}</div>
      )}

      {loading ? (
        <div className="loading-inline">
          <div className="loading-spinner loading-md" />
          <p>Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>{searchInput ? `No courses found for "${searchInput}"` : 'No courses available yet.'}</p>
          {searchInput && (
            <button className="btn btn-sm btn-secondary" onClick={() => setSearchInput('')}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              variant="browse"
              isOwner={course.instructor?.id === user?.id}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      )}

      {pageCount > 1 && !loading && (
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
  );
}
