import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const displayUser = profile || user;
  const isInstructor = displayUser?.role === 'INSTRUCTOR' || displayUser?.role === 'ADMIN';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Hello, {user?.name}! Ready to continue learning?</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>My Profile</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> {displayUser?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {displayUser?.email || 'N/A'}</p>
            <p><strong>Role:</strong> {displayUser?.role || 'Student'}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>My Courses</h3>
          <p>{isInstructor ? 'Manage your own courses and stay on top of new content.' : 'Browse available courses and find your next class.'}</p>
          <Link to="/manage-courses" className="btn-primary">Manage Courses</Link>
        </div>

        {isInstructor && (
          <div className="dashboard-card">
            <h3>Instructor Controls</h3>
            <p>Use the courses page to create, edit, or delete the content you own.</p>
            <div className="quick-actions">
              <Link to="/courses" className="btn-secondary">Go to Courses</Link>
            </div>
          </div>
        )}

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <p>No recent activity to show.</p>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/courses" className="btn-secondary">View All Courses</Link>
            <Link to="/profile" className="btn-secondary">Update Profile</Link>
            <button className="btn-secondary" disabled>Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}