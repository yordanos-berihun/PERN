import React, { useEffect, useState } from 'react';
import { coursesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function MyEnrollments() {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) fetchEnrolled();
  }, [isAuthenticated]);

  async function fetchEnrolled() {
    setLoading(true);
    setMessage('');
    try {
      const res = await coursesAPI.getEnrolled();
      setCourses(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Unable to load enrollments.');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="my-enrollments-page">
        <h2>My Enrollments</h2>
        <p>You must be logged in to view your enrollments.</p>
      </div>
    );
  }

  return (
    <div className="my-enrollments-page">
      <h2>My Enrollments</h2>
      {message && <div className="status-message">{message}</div>}
      {loading && <p>Loading...</p>}
      {!loading && courses.length === 0 && <p>No enrollments found.</p>}
      <div className="courses-grid">
        {courses.map((course) => (
          <div className="card" key={course.id}>
            <div className="course-card-header">
              <h3>{course.title}</h3>
              <span className="badge">{course.published ? 'Published' : 'Draft'}</span>
            </div>
            <p>{course.description || 'No description yet.'}</p>
            <div className="course-meta">
              <span>Instructor: {course.instructor?.name || course.instructor?.email}</span>
              <span>Price: ${course.price?.toFixed(2) ?? '0.00'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
