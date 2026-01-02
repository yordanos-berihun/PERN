import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, isLoginLoading, loginError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className=\"auth-container\">
      <div className=\"auth-card\">
        <h2>Login to Your Account</h2>
        
        {loginError && (
          <div className=\"error-message\">
            {loginError.response?.data?.error || 'Login failed'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className=\"auth-form\">
          <div className=\"form-group\">
            <label htmlFor=\"email\">Email</label>
            <input
              type=\"email\"
              id=\"email\"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className=\"field-error\">{errors.email.message}</span>
            )}
          </div>

          <div className=\"form-group\">
            <label htmlFor=\"password\">Password</label>
            <input
              type=\"password\"
              id=\"password\"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className=\"field-error\">{errors.password.message}</span>
            )}
          </div>

          <button 
            type=\"submit\" 
            disabled={isLoginLoading}
            className=\"auth-button\"
          >
            {isLoginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className=\"auth-link\">
          Don't have an account? <Link to=\"/register\">Sign up</Link>
        </p>
      </div>
    </div>
  );
}