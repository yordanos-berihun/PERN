import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const displayUser = profile || user;

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
          <p>Browse all available courses and enroll in your next class.</p>
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <p>No recent activity to show.</p>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/courses" className="btn-secondary">View All Courses</Link>
            <button className="btn-secondary" disabled>Update Profile</button>
            <button className="btn-secondary" disabled>Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}