import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import ManageCourses from './pages/ManageCourses';
import MyEnrollments from './pages/MyEnrollments';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">LMS Pro</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          {user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' ? (
            <Link to="/manage-courses">Manage Courses</Link>
          ) : null}
          
          {isAuthenticated ? (
            <>
              {user?.role === 'STUDENT' && <Link to="/enrollments">My Enrollments</Link>}
              <Link to="/dashboard">Dashboard</Link>
              <div className="user-menu">
                <span>Welcome, {user?.name}</span>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
          <Route path="/enrollments" element={<MyEnrollments />} />
        <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
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