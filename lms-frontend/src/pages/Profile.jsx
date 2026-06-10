import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, profile, updateProfile, isUpdateProfileLoading, updateProfileError } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      password: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    reset({
      name: profile?.name || user?.name || '',
      email: profile?.email || user?.email || '',
      currentPassword: '',
      password: '',
      confirmPassword: ''
    });
  }, [profile, user, reset]);

  const password = watch('password');

  const onSubmit = async (data) => {
    setSuccessMessage('');

    try {
      await updateProfile(data);
      setSuccessMessage('Profile updated successfully.');
      reset({
        name: data.name,
        email: data.email,
        currentPassword: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      // Errors are handled through the hook state and displayed below.
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Manage Your Profile</h2>
        <p className="muted-note">Update your name, email, or password here.</p>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {updateProfileError && (
          <div className="error-message">
            {updateProfileError.response?.data?.error || 'Failed to update profile'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              {...register('currentPassword', {
                validate: (value) =>
                  !password || value.length > 0 || 'Current password is required to set a new password'
              })}
              className={errors.currentPassword ? 'error' : ''}
            />
            {errors.currentPassword && (
              <span className="field-error">{errors.currentPassword.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                validate: (value) =>
                  !password || value === password || 'Passwords do not match'
              })}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button type="submit" disabled={isUpdateProfileLoading} className="auth-button">
            {isUpdateProfileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
