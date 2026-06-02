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
  const price = course.price?.toFixed(2) ?? '0.00';
  const instructor = course.instructor?.name || course.instructor?.email;

  return (
    <div className="card course-card">
      <div className="course-card-accent" />
      <div className="course-card-body">
        <div className="course-card-header">
          <Link to={`/courses/${course.id}`} className="course-title-link">
            <h3>{course.title}</h3>
          </Link>
          {variant === 'browse' && isOwner && <span className="badge badge-owner">Yours</span>}
          {(variant === 'manage' || variant === 'enrollment') && (
            <span className={`badge ${course.published ? 'badge-published' : 'badge-draft'}`}>
              {course.published ? 'Published' : 'Draft'}
            </span>
          )}
        </div>

        <p className="course-card-desc">{course.description || 'No description available.'}</p>

        <div className="course-meta">
          {variant !== 'manage' && instructor && <span>👤 {instructor}</span>}
          <span>{Number(price) === 0 ? 'Free' : `$${price}`}</span>
        </div>

        <div className="course-actions">
          {(variant === 'browse' && isOwner) || variant === 'manage' ? (
            <>
              <button className="btn btn-sm btn-secondary" onClick={() => onEdit?.(course)} disabled={loading}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete?.(course.id)} disabled={loading}>Delete</button>
            </>
          ) : variant === 'browse' && !isOwner ? (
            <button className="btn btn-sm btn-primary" onClick={() => onEnroll?.(course.id)} disabled={loading}>Enroll</button>
          ) : variant === 'enrollment' ? (
            <span className="badge badge-enrolled">✓ Enrolled</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
