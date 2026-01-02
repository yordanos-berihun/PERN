import React, { useState } from 'react'
import api from '../services/api'

export default function Register(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [msg,setMsg] = useState('')

  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('token', res.token)
      setMsg('Registered')
    }catch(err){ setMsg('Register failed') }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button>Register</button>
      </form>
      <p>{msg}</p>
    </div>
  )
}
