import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Login.css';
import { fetchUser, loginUser } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import spinner from '/spinner.gif';
import { showToast } from '../utils/toastUtils';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const dispatch = useDispatch();
    const { loading,success } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(fetchUser())
    }, [])

    const handleLogin = (event) => {
        event.preventDefault();
        dispatch(loginUser(formData))
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                showToast('error', error || 'Login failed. Please try again.');
            });
    };

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if(success){
        return <Navigate to={'/'} />
    }

    return loading ? (
        <div className="spinner">
            <img src={spinner} alt="Loading..." />
        </div>
    ) : (
        <div className="login">
            <ToastContainer theme="dark"/>
            <form onSubmit={handleLogin} className="loginForm">
                <h1>User Login</h1>
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
            <p className="signupLink">
                Create account{' '}
                <Link to="/signup">
                    <span>Signup</span>
                </Link>
            </p>
        </div>
    );
};

export default Login;
