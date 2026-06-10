import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({
  course,
  variant = 'browse',
  isOwner = false,
  onEdit,
  onDelete,
  onEnroll,
  loading = false
}) {
  const price = course.price?.toFixed(2) ?? '0.00';
  const isFree = Number(price) === 0;
  const instructor = course.instructor?.name || course.instructor?.email;

  return (
    <div className="card course-card">
      <div className="course-card-accent" />
      <div className="course-card-body">
        <div className="course-card-header">
          <Link to={`/courses/${course.id}`} className="course-title-link">
            <h3>{course.title}</h3>
          </Link>
          {variant === 'browse' && isOwner && (
            <span className="badge badge-owner">Yours</span>
          )}
          {variant === 'browse' && !isOwner && course.enrolled && (
            <span className="badge badge-enrolled">✓ Enrolled</span>
          )}
          {(variant === 'manage') && (
            <span className={`badge ${course.published ? 'badge-published' : 'badge-draft'}`}>
              {course.published ? 'Published' : 'Draft'}
            </span>
          )}
          {variant === 'enrollment' && (
            <span className="badge badge-enrolled">✓ Enrolled</span>
          )}
        </div>

        <p className="course-card-desc">
          {course.description || 'No description available.'}
        </p>

        <div className="course-card-meta">
          {variant !== 'manage' && instructor && (
            <span className="meta-item">👤 {instructor}</span>
          )}
          <span className={`meta-item price-tag ${isFree ? 'price-free' : ''}`}>
            {isFree ? 'Free' : `$${price}`}
          </span>
          {variant === 'manage' && (
            <span className="meta-item">
              {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="course-actions">
          {variant === 'manage' || (variant === 'browse' && isOwner) ? (
            <>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onEdit?.(course)}
                disabled={loading}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete?.(course.id)}
                disabled={loading}
              >
                Delete
              </button>
            </>
          ) : variant === 'browse' && !isOwner ? (
            <>
              <Link to={`/courses/${course.id}`} className="btn btn-sm btn-secondary">
                Details
              </Link>
              {course.enrolled ? (
                <Link to="/enrollments" className="btn btn-sm btn-secondary">
                  My Enrollments
                </Link>
              ) : (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onEnroll?.(course.id)}
                  disabled={loading}
                >
                  Enroll
                </button>
              )}
            </>
          ) : variant === 'enrollment' ? (
            <Link to={`/courses/${course.id}`} className="btn btn-sm btn-secondary">
              View Course
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
