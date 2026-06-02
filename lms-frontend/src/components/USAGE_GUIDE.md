/**
 * UI Components Usage Guide
 * 
 * This file demonstrates how to use all the reusable UI components
 * in your LMS application.
 */

// ============================================
// 1. BUTTON COMPONENT
// ============================================
/**
 * Basic Button
 */
import { Button } from '../components';

// Primary button
<Button onClick={handleClick}>Click me</Button>

// Primary button with loading state
<Button loading loadingText="Saving...">Save</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>Delete</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// Disabled state
<Button disabled>Disabled</Button>

// As form submit button
<Button type="submit" loading={isSubmitting}>Submit Form</Button>


// ============================================
// 2. MODAL COMPONENT
// ============================================
/**
 * Basic Modal
 */
import { Modal, Button } from '../components';
import { useState } from 'react';

export default function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Delete"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => {
              handleDelete();
              setIsOpen(false);
            }}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this course? This action cannot be undone.</p>
      </Modal>
    </>
  );
}


// ============================================
// 3. LOADING COMPONENT
// ============================================
/**
 * Different loading variants
 */
import { Loading } from '../components';

// Spinner (default)
<Loading text="Loading courses..." />
<Loading text="Loading..." size="lg" />

// Dots variant
<Loading variant="dots" text="Please wait..." />

// Skeleton variant (useful for placeholders)
<Loading variant="skeleton" text="Loading content..." />

// Fullscreen loading overlay
<Loading fullscreen text="Processing..." size="lg" />

// Without text
<Loading size="md" />


// ============================================
// 4. ALERT COMPONENT
// ============================================
/**
 * Different alert types
 */
import { Alert } from '../components';

// Success alert
<Alert 
  type="success" 
  message="Course created successfully!" 
  onClose={() => console.log('closed')}
/>

// Error alert
<Alert 
  type="error" 
  message="Failed to save course. Please try again."
/>

// Warning alert
<Alert 
  type="warning" 
  message="This course has not been published yet."
/>

// Info alert
<Alert 
  type="info" 
  message="You need to be logged in to enroll."
/>

// Auto-close after 3 seconds
<Alert 
  type="success" 
  message="Changes saved!" 
  autoClose={3000}
  onClose={handleAlertClose}
/>

// Without close button
<Alert 
  type="info" 
  message="Information message"
  dismissible={false}
/>


// ============================================
// 5. PRACTICAL EXAMPLE: ManageCourses
// ============================================
/**
 * Using multiple components together
 */
import React, { useState } from 'react';
import { Button, Modal, Loading, Alert } from '../components';

export default function ManageCourses() {
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [message, setMessage] = useState(null);
  const [courses, setCourses] = useState([]);

  const handleDeleteClick = (course) => {
    setDeleteModal(course);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      // Delete API call
      await deleteCourse(deleteModal.id);
      setMessage({
        type: 'success',
        text: 'Course deleted successfully!'
      });
      setDeleteModal(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete course'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullscreen text="Loading courses..." />;
  }

  return (
    <div>
      {message && (
        <Alert
          type={message.type}
          message={message.text}
          autoClose={4000}
          onClose={() => setMessage(null)}
        />
      )}

      <Button onClick={() => console.log('new')}>Create Course</Button>

      {/* Course list */}
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <Button size="sm" variant="secondary">Edit</Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeleteClick(course)}
          >
            Delete
          </Button>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Course"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={loading}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete "{deleteModal?.title}"?</p>
      </Modal>
    </div>
  );
}


// ============================================
// 6. COMPONENT PROPS REFERENCE
// ============================================

/**
 * Button Props
 * @param {string} [variant='primary'] - 'primary' | 'secondary' | 'danger'
 * @param {string} [size='md'] - 'sm' | 'md' | 'lg'
 * @param {boolean} [loading=false] - Show loading state
 * @param {string} [loadingText='Loading...'] - Text while loading
 * @param {boolean} [disabled=false] - Disable button
 * @param {function} [onClick] - Click handler
 * @param {string} [className] - Additional CSS classes
 * @param {string} [type='button'] - 'button' | 'submit' | 'reset'
 */

/**
 * Modal Props
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} [footer] - Modal footer
 * @param {boolean} [closeButton=true] - Show close button
 * @param {string} [size='md'] - 'sm' | 'md' | 'lg'
 */

/**
 * Loading Props
 * @param {string} [text='Loading...'] - Loading message
 * @param {string} [size='md'] - 'sm' | 'md' | 'lg'
 * @param {string} [variant='spinner'] - 'spinner' | 'dots' | 'skeleton'
 * @param {boolean} [fullscreen=false] - Full screen overlay
 */

/**
 * Alert Props
 * @param {string} [type='info'] - 'success' | 'error' | 'warning' | 'info'
 * @param {string} message - Alert message
 * @param {function} [onClose] - Close handler
 * @param {boolean} [dismissible=true] - Show close button
 * @param {number} [autoClose=null] - Auto close after ms
 */
