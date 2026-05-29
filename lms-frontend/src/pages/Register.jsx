import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Register(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [msg,setMsg] = useState('')

  const { register: registerUser, isRegisterLoading, registerError } = useAuth();

  async function submit(e){
    e.preventDefault();
    try{
      registerUser({ name, email, password });
      setMsg('Registering...');
    }catch(err){
      setMsg('Register failed');
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>

        {registerError && (
          <div className="error-message">{registerError.response?.data?.error || 'Registration failed'}</div>
        )}

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={e=>setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={isRegisterLoading} className="auth-button">
            {isRegisterLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">{msg}</p>
      </div>
    </div>
  )
}
