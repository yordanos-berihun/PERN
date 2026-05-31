import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function CourseDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchCourse() {
    setFetching(true);
    setMessage('');
    setMessageType('');
    try {
      const res = await coursesAPI.getById(id);
      setCourse(res.data.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Failed to load course.');
      setMessageType('error');
    } finally {
      setFetching(false);
    }
  }

  async function handleEnroll() {
    if (!isAuthenticated) {
      setMessage('Please log in to enroll in this course.');
      setMessageType('info');
      return;
    }

    setEnrolling(true);
    setMessage('');
    setMessageType('');
    try {
      await coursesAPI.enroll(id);
      setCourse((prev) => (prev ? { ...prev, enrolled: true } : prev));
      setMessage('You are now enrolled!');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to enroll.');
      setMessageType('error');
    } finally {
      setEnrolling(false);
    }
  }

  if (fetching && !course) return <p>Loading course details...</p>;

  return (
    <div className="course-detail-page">
      <div className="back-link">
        <Link to="/courses">← Back to courses</Link>
      </div>

      {message && (
        <div className={`status-message ${messageType}`}>{message}</div>
      )}

      {!course ? (
        <p>Course not found.</p>
      ) : (
        <div className="course-detail-card">
          <div className="course-detail-header">
            <div>
              <h2>{course.title}</h2>
              <p className="muted-note">Created {new Date(course.createdAt).toLocaleDateString()}</p>
            </div>
            {course.published ? (
              <span className="badge badge-pill success">Published</span>
            ) : (
              <span className="badge badge-pill muted">Draft</span>
            )}
          </div>

          <p className="course-description">{course.description || 'No description available.'}</p>

          <div className="course-meta">
            <span>Instructor: {course.instructor?.name || course.instructor?.email}</span>
            <span>Price: ${course.price?.toFixed(2) ?? '0.00'}</span>
            <span>{course.enrollmentCount ?? 0} students enrolled</span>
          </div>

          <div className="course-actions">
            {user?.id === course.instructor?.id ? (
              <span className="badge">Your course</span>
            ) : course.enrolled ? (
              <>
                <span className="badge success">Already enrolled</span>
                <Link to="/enrollments" className="btn-secondary">
                  View my enrollments
                </Link>
              </>
            ) : isAuthenticated ? (
              <button
                className="btn-primary"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Processing...' : 'Enroll now'}
              </button>
            ) : (
              <Link to="/login" className="btn-primary">
                Login to enroll
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
