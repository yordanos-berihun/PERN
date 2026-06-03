import React, { useState } from 'react';
import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import ManageCourses from './pages/ManageCourses';
import MyEnrollments from './pages/MyEnrollments';
import Profile from './pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false }
  }
});

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const navClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" onClick={closeMenu}>LMS Pro</Link>
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <div className={`nav-links${menuOpen ? ' nav-open' : ''}`}>
          <NavLink to="/" end className={navClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/courses" className={navClass} onClick={closeMenu}>Courses</NavLink>

          {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
            <NavLink to="/manage-courses" className={navClass} onClick={closeMenu}>
              Manage Courses
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              {user?.role === 'STUDENT' && (
                <NavLink to="/enrollments" className={navClass} onClick={closeMenu}>
                  My Enrollments
                </NavLink>
              )}
              <NavLink to="/dashboard" className={navClass} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <div className="user-menu">
                <Link to="/profile" className="nav-profile-link" onClick={closeMenu}>
                  {user?.name}
                </Link>
                <button onClick={() => { logout(); closeMenu(); }} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass} onClick={closeMenu}>Login</NavLink>
              <NavLink to="/register" className={navClass} onClick={closeMenu}>
                <span className="nav-cta">Register</span>
              </NavLink>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/manage-courses" element={isAuthenticated ? <ManageCourses /> : <Navigate to="/login" />} />
          <Route path="/enrollments" element={<MyEnrollments />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={
            <div className="not-found">
              <h2>404 — Page not found</h2>
              <Link to="/" className="btn btn-md btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                Go Home
              </Link>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
