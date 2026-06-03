import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  {
    icon: '🔐',
    title: 'Secure Authentication',
    desc: 'Register or log in as a student or instructor. Your session is persisted and protected with JWT.'
  },
  {
    icon: '📚',
    title: 'Course Management',
    desc: 'Instructors can create, edit, and publish courses. Students can browse and enroll instantly.'
  },
  {
    icon: '🎓',
    title: 'Track Enrollments',
    desc: 'Students have a dedicated enrollments page. Instructors see live course stats on their dashboard.'
  }
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-card">
        <div className="hero-badge">🚀 Open Source LMS Starter</div>
        <h1>Learn and Teach, Together</h1>
        <p>A full-stack learning management system built with React, Node.js, and PostgreSQL.</p>
        <div className="hero-actions">
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-secondary">Go to Dashboard</Link>
          ) : (
            <Link to="/register" className="btn-secondary">Get Started Free</Link>
          )}
        </div>
      </section>

      <section className="features-grid">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {!isAuthenticated && (
        <section className="home-cta">
          <h2>Ready to get started?</h2>
          <p>Join as a student to enroll in courses, or sign up as an instructor to share your knowledge.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">Create an Account</Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
          </div>
        </section>
      )}
    </div>
  );
}
