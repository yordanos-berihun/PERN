import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="home-page">
      <section className="hero-card">
        <h1>Welcome to LMS Pro</h1>
        <p>Learn, teach, and manage courses with a simple React and Node LMS starter app.</p>
        <div className="hero-actions">
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
          <Link to="/login" className="btn-secondary">Login / Register</Link>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <h3>Easy Authentication</h3>
          <p>Register, login, and see your account dashboard instantly.</p>
        </div>
        <div className="feature-card">
          <h3>Course Management</h3>
          <p>View courses and manage them from a clean interface.</p>
        </div>
        <div className="feature-card">
          <h3>Ready to Extend</h3>
          <p>This app is ready for enrollment, instructor dashboards, and payment flow.</p>
        </div>
      </section>
    </div>
  )
}
