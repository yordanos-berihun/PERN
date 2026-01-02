import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, profile } = useAuth();

  return (
    <div className=\"dashboard\">
      <div className=\"dashboard-header\">
        <h1>Welcome to Your Dashboard</h1>
        <p>Hello, {user?.name}! Ready to continue learning?</p>
      </div>

      <div className=\"dashboard-grid\">
        <div className=\"dashboard-card\">
          <h3>My Profile</h3>
          <div className=\"profile-info\">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role || 'Student'}</p>
          </div>
        </div>

        <div className=\"dashboard-card\">
          <h3>My Courses</h3>
          <p>You haven't enrolled in any courses yet.</p>
          <button className=\"btn-primary\">Browse Courses</button>
        </div>

        <div className=\"dashboard-card\">
          <h3>Recent Activity</h3>
          <p>No recent activity to show.</p>
        </div>

        <div className=\"dashboard-card\">
          <h3>Quick Actions</h3>
          <div className=\"quick-actions\">
            <button className=\"btn-secondary\">View All Courses</button>
            <button className=\"btn-secondary\">Update Profile</button>
            <button className=\"btn-secondary\">Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}