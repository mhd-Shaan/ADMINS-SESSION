import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
function ManageStore() {

  const token = localStorage.getItem('token');
const navigate = useNavigate()
  
  return (
    <div>
      <h1>Manage store</h1>
    </div>
  )
}

export default ManageStore
