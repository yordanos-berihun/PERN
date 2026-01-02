import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Courses(){
  const [courses,setCourses] = useState([])
  useEffect(()=>{ fetchCourses() },[])
  async function fetchCourses(){
    try{
      const res = await api.get('/courses')
      setCourses(res)
    }catch(err){ console.error(err) }
  }
  return (
    <div>
      <h2>Courses</h2>
      {courses.length===0 && <p>No courses yet.</p>}
      {courses.map(c=> (
        <div className="card" key={c._id}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <small>Author: {c.author?.name || c.author?.email}</small>
        </div>
      ))}
    </div>
  )
}
