import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { coursesAPI } from '../services/api';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const displayUser = profile || user;
  const isInstructor = displayUser?.role === 'INSTRUCTOR' || displayUser?.role === 'ADMIN';

  const [stats, setStats] = useState({ count: 0, loading: true, error: false });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = isInstructor
          ? await coursesAPI.getMine(1, 1)
          : await coursesAPI.getEnrolled(1, 1);
        setStats({ count: res.data.meta?.total ?? 0, loading: false, error: false });
      } catch {
        setStats({ count: 0, loading: false, error: true });
      }
    }
    fetchStats();
  }, [isInstructor]);

  const roleLabel = displayUser?.role
    ? displayUser.role.charAt(0) + displayUser.role.slice(1).toLowerCase()
    : 'Student';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {displayUser?.name || 'there'}!</h1>
        <p>Here's an overview of your account.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card profile-card">
          <h3>My Profile</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> {displayUser?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {displayUser?.email || 'N/A'}</p>
            <p><strong>Role:</strong> {roleLabel}</p>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/profile" className="btn btn-sm btn-secondary">Edit Profile</Link>
          </div>
        </div>

        <div className="dashboard-card stat-card">
          <h3>{isInstructor ? 'My Courses' : 'Enrolled Courses'}</h3>
          <div className="stat-number">
            {stats.loading ? '—' : stats.error ? '!' : stats.count}
          </div>
          <p className="stat-label" style={stats.error ? { color: '#ef4444' } : {}}>
            {stats.error
              ? 'Could not load stats'
              : isInstructor ? 'courses created' : 'courses enrolled'}
          </p>
          <div style={{ marginTop: '1rem' }}>
            {isInstructor
              ? <Link to="/manage-courses" className="btn btn-sm btn-primary">Manage Courses</Link>
              : <Link to="/enrollments" className="btn btn-sm btn-primary">View Enrollments</Link>
            }
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/courses" className="btn btn-sm btn-secondary">Browse Courses</Link>
            {isInstructor && (
              <Link to="/manage-courses" className="btn btn-sm btn-secondary">Manage Courses</Link>
            )}
            {!isInstructor && (
              <Link to="/enrollments" className="btn btn-sm btn-secondary">My Enrollments</Link>
            )}
            <Link to="/profile" className="btn btn-sm btn-secondary">Update Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
