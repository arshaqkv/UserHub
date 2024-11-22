import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../features/adminSlice';
import './CreateUser.css'
import { showToast } from '../utils/toastUtils';
import AdminSidebar from '../components/AdminSidebar';
import { ToastContainer } from 'react-toastify';
import spinner from '/spinner.gif';

const CreateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.admin);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        profilePicture: null,
    });
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setUserData({ ...userData, profilePicture: file });
            setPreview(URL.createObjectURL(file));
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        if (userData.profilePicture) {
            formData.append('profilePicture', userData.profilePicture);
        }
            dispatch(createUser(formData)).unwrap()
            .then(()=>{
                navigate('/admin/dashboard')
            })
            .catch((error) => {
                showToast('error', error);
            })
    };

    if (loading) {
        return (
            <div className="spinner">
                <img src={spinner} alt="Loading..." />
            </div>
        );
    }


    return (
        <div className="create-user">
            <ToastContainer theme='dark'/>
            <AdminSidebar />
            <form onSubmit={handleSubmit} className="create-user-form" aria-label="Create User Form">
            <h2>Add New User</h2>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                name="username"
                id="username"
                value={userData.username}
                placeholder="Enter Username"
                onChange={handleChange}
                required
            />
            <label htmlFor="email">Email</label>
            <input
                type="email"
                name="email"
                id="email"
                value={userData.email}
                placeholder="Enter Email"
                onChange={handleChange}
                required
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                name="password"
                id="password"
                value={userData.password}
                placeholder="Enter Password"
                onChange={handleChange}
                required
            />
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
            />
            {preview && (
                <img
                    src={preview}
                    alt="Profile Preview"
                    className="profile-preview"
                />
            )}
            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
            </button>
            <Link to="/admin/dashboard" className="cancel-button">
                Cancel
            </Link>
        </form>

        </div>
    );
};

export default CreateUser;
