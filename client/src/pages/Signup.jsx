
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../features/authSlice'
import { toast, ToastContainer } from 'react-toastify'
import { showToast } from '../utils/toastUtils'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const onChange = (e)=> {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSignup = (event)=>{
    event.preventDefault()
  
    dispatch(signupUser(formData))
    .unwrap()
    .then(() => {
        navigate('/')
    })
    .catch((error) => {
        showToast('error', error)
    });
  }
  return (
    <div className='signup'>
      <ToastContainer theme='dark'/>
      <form onSubmit={handleSignup} className='signupForm'>
        <h1>Signup now</h1>
        <input type="text" name='username'  onChange={onChange} placeholder='Enter username'/>
        <input type="email" name='email' onChange={onChange} placeholder='Enter email'/>
        <input type="password" name='password' onChange={onChange} placeholder='Enter password'/>
     
        <button type='submit' className='signupButton'>
          {loading? 'Registering...' : 'Signup'}
        </button>
        
      </form>
      <p className='loginLink'>Already have an account?<Link to={'/login'}>Login</Link></p>
    </div>
  )
}

export default Signup
