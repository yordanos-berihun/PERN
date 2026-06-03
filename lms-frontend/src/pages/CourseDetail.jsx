import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function CourseDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [fetching, setFetching] = useState(true);
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
      setCourse((prev) => prev ? { ...prev, enrolled: true, enrollmentCount: (prev.enrollmentCount ?? 0) + 1 } : prev);
      setMessage('You are now enrolled!');
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to enroll.');
      setMessageType('error');
    } finally {
      setEnrolling(false);
    }
  }

  if (fetching) return (
    <div className="loading-inline">
      <div className="loading-spinner loading-md" />
      <p>Loading course...</p>
    </div>
  );

  const isFree = !course?.price || course.price === 0;
  const isOwner = user?.id === course?.instructor?.id;

  return (
    <div className="course-detail-page">
      <div className="back-link">
        <Link to="/courses">← Back to courses</Link>
      </div>

      {message && (
        <div className={`status-message ${messageType}`}>{message}</div>
      )}

      {!course ? (
        <div className="empty-state">
          <p>Course not found.</p>
          <Link to="/courses" className="btn btn-md btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="course-detail-card">
          <div className="course-detail-header">
            <div>
              <h2>{course.title}</h2>
              <p className="muted-note">
                By {course.instructor?.name || course.instructor?.email}
                &nbsp;&middot;&nbsp;
                Added {new Date(course.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`badge badge-pill ${course.published ? 'badge-published' : 'badge-draft'}`}>
              {course.published ? 'Published' : 'Draft'}
            </span>
          </div>

          <p className="course-description">
            {course.description || 'No description available.'}
          </p>

          <div className="course-meta">
            <span>💰 {isFree ? 'Free' : `$${course.price.toFixed(2)}`}</span>
            <span>👥 {course.enrollmentCount ?? 0} student{course.enrollmentCount !== 1 ? 's' : ''} enrolled</span>
          </div>

          <div className="course-actions">
            {isOwner ? (
              <>
                <span className="badge badge-owner">Your course</span>
                <Link to="/manage-courses" className="btn btn-md btn-secondary">
                  Manage Courses
                </Link>
              </>
            ) : course.enrolled ? (
              <>
                <span className="badge badge-enrolled">✓ Enrolled</span>
                <Link to="/enrollments" className="btn btn-md btn-secondary">
                  My Enrollments
                </Link>
              </>
            ) : isAuthenticated ? (
              <button
                className="btn btn-md btn-primary"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Processing...' : isFree ? 'Enroll for Free' : `Enroll — $${course.price.toFixed(2)}`}
              </button>
            ) : (
              <Link to="/login" className="btn btn-md btn-primary">
                Login to Enroll
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
