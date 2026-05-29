import React, { useEffect, useState } from 'react'
import { coursesAPI } from '../services/api'

export default function Courses(){
  const [courses,setCourses] = useState([])
  useEffect(()=>{ fetchCourses() },[])
  async function fetchCourses(){
    try{
      const res = await coursesAPI.getAll()
      setCourses(res.data.data || [])
    }catch(err){ console.error(err) }
  }
  return (
    <div>
      <h2>Courses</h2>
      {courses.length===0 && <p>No courses yet.</p>}
      {courses.map(c=> (
        <div className="card" key={c.id}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <small>Instructor: {c.instructor?.name || c.instructor?.email}</small>
        </div>
      ))}
    </div>
  )
}
