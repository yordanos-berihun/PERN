import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function CourseDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchCourse() {
    setLoading(true);
    setMessage('');
    try {
      const res = await coursesAPI.getById(id);
      setCourse(res.data.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Failed to load course.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll() {
    if (!isAuthenticated) {
      setMessage('You must be logged in to enroll.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await coursesAPI.enroll(id);
      setMessage('Enrolled successfully.');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to enroll.');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !course) return <p>Loading course...</p>;

  return (
    <div className="course-detail-page">
      <div className="back-link">
        <Link to="/courses">← Back to courses</Link>
      </div>

      {message && <div className="status-message">{message}</div>}

      {!course ? (
        <p>Course not found.</p>
      ) : (
        <div className="course-detail-card">
          <h2>{course.title}</h2>
          <p>{course.description || 'No description available.'}</p>
          <div className="course-meta">
            <span>Instructor: {course.instructor?.name || course.instructor?.email}</span>
            <span>Price: ${course.price?.toFixed(2) ?? '0.00'}</span>
          </div>

          <div className="course-actions">
            {user?.id === course.instructor?.id ? (
              <span className="badge">Your course</span>
            ) : (
              <button className="btn-primary" onClick={handleEnroll} disabled={loading}>
                {loading ? 'Processing...' : 'Enroll'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
