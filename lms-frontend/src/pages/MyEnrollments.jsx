import React, { useEffect, useState } from 'react';
import { coursesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import CourseCard from '../components/CourseCard';

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
          <CourseCard
            key={course.id}
            course={course}
            variant="enrollment"
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
