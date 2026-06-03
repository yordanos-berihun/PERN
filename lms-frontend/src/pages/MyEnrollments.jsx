import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import CourseCard from '../components/CourseCard';

const PAGE_SIZE = 9;

export default function MyEnrollments() {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    if (isAuthenticated) fetchEnrolled(currentPage);
  }, [isAuthenticated, currentPage]);

  async function fetchEnrolled(page = 1) {
    setLoading(true);
    setMessage('');
    try {
      const res = await coursesAPI.getEnrolled(page, PAGE_SIZE);
      setCourses(res.data.data || []);
      if (res.data.meta) setPageMeta(res.data.meta);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load enrollments.');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="my-enrollments-page">
        <div className="empty-state">
          <span className="empty-icon">🔒</span>
          <p>You must be logged in to view your enrollments.</p>
          <Link to="/login" className="btn btn-md btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const pageCount = Math.max(pageMeta.totalPages, 1);

  return (
    <div className="my-enrollments-page">
      <div className="courses-header">
        <div>
          <h2>My Enrollments</h2>
          <p className="page-summary">
            {loading ? '...' : `${pageMeta.total} course${pageMeta.total !== 1 ? 's' : ''} enrolled`}
          </p>
        </div>
      </div>

      {message && <div className="status-message error">{message}</div>}

      {loading ? (
        <div className="loading-inline">
          <div className="loading-spinner loading-md" />
          <p>Loading enrollments...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn btn-md btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              variant="enrollment"
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
