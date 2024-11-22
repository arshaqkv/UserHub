import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import { adminLogin, fetchAllUsers } from '../features/adminSlice';
import spinner from '/spinner.gif'
import { showToast } from '../utils/toastUtils';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const dispatch = useDispatch();
    const { loading, success } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    useEffect(() =>{
        dispatch(fetchAllUsers())
    }, [])

    const handleLogin = (event) => {
        event.preventDefault();
        loading
        dispatch(adminLogin(formData))
            .unwrap()
            .then(() => {
                showToast('success', 'Login successfull')
                navigate('/admin/dashboard'); // Redirect after successful login
            })
            .catch((error) => {
                showToast('error', error)
            });
        loading
    };

    if(success){
        return <Navigate to={'/admin/dashboard'}/>
    }

    return (
        loading 
        ? <div className="spinner">
            <img src={spinner} alt="" />
          </div>
        :
        <div className="login">
            <ToastContainer theme='dark' /> {/* Toast container to show notifications */}

            <form onSubmit={handleLogin} className="loginForm">
                <h1>Admin Login</h1>
                <input
                    type="email"
                    name="email"
                    onChange={onChange}
                    placeholder="Enter email"
                    value={formData.email}
                />
                <input
                    type="password"
                    name="password"
                    onChange={onChange}
                    placeholder="Enter password"
                    value={formData.password}
                />
                <button type="submit" className="loginButton" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
