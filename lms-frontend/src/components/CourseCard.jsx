import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable CourseCard component
 * @param {Object} course - The course data object
 * @param {string} [variant] - 'browse' | 'manage' | 'enrollment' (default: 'browse')
 * @param {boolean} [isOwner] - Whether the current user owns this course
 * @param {function} [onEdit] - Callback for edit action
 * @param {function} [onDelete] - Callback for delete action
 * @param {function} [onEnroll] - Callback for enroll action
 * @param {boolean} [loading] - Loading state for buttons
 */
export default function CourseCard({
  course,
  variant = 'browse',
  isOwner = false,
  onEdit,
  onDelete,
  onEnroll,
  loading = false
}) {
  return (
    <div className="card">
      <div className="course-card-header">
        <Link to={`/courses/${course.id}`} className="course-title-link">
          <h3>{course.title}</h3>
        </Link>
        {variant === 'browse' && isOwner && <span className="badge">Your course</span>}
        {variant === 'manage' && <span className="badge">{course.published ? 'Published' : 'Draft'}</span>}
        {variant === 'enrollment' && <span className="badge">{course.published ? 'Published' : 'Draft'}</span>}
      </div>

      <p>{course.description || 'No description available.'}</p>

      <div className="course-meta">
        {variant === 'browse' && (
          <>
            <span>Instructor: {course.instructor?.name || course.instructor?.email}</span>
            <span>Price: ${course.price?.toFixed(2) ?? '0.00'}</span>
          </>
        )}
        {variant === 'manage' && (
          <span>Price: ${course.price?.toFixed(2) ?? '0.00'}</span>
        )}
        {variant === 'enrollment' && (
          <>
            <span>Instructor: {course.instructor?.name || course.instructor?.email}</span>
            <span>Price: ${course.price?.toFixed(2) ?? '0.00'}</span>
          </>
        )}
      </div>

      <div className="course-actions">
        {variant === 'browse' && isOwner && (
          <>
            <button className="btn-secondary" onClick={() => onEdit?.(course)} disabled={loading}>
              Edit
            </button>
            <button className="btn-danger" onClick={() => onDelete?.(course.id)} disabled={loading}>
              Delete
            </button>
          </>
        )}
        {variant === 'browse' && !isOwner && (
          <button className="btn-primary" onClick={() => onEnroll?.(course.id)} disabled={loading}>
            Enroll
          </button>
        )}
        {variant === 'manage' && (
          <>
            <button className="btn-secondary" onClick={() => onEdit?.(course)} disabled={loading}>
              Edit
            </button>
            <button className="btn-danger" onClick={() => onDelete?.(course.id)} disabled={loading}>
              Delete
            </button>
          </>
        )}
        {variant === 'enrollment' && (
          <div className="course-actions-placeholder">
            <p>Enrolled</p>
          </div>
        )}
      </div>
    </div>
  );
}
