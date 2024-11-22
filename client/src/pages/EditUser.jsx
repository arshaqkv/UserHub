import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserDetails, updateUser } from '../features/adminSlice';
import './EditUser.css';
import spinner from '/spinner.gif';
import { showToast } from '../utils/toastUtils';
import { ToastContainer } from 'react-toastify';
import AdminSidebar from '../components/AdminSidebar';

const EditUser = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userDetails, loading, error } = useSelector((state) => state.admin);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        profilePicture: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(fetchUserDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (userDetails) {
            setUserData({
                username: userDetails.username || '',
                email: userDetails.email || '',
                profilePicture: userDetails.profilePicture || ''
            });
            setPreview(userDetails.profilePicture ? `http://localhost:3000/server${userDetails.profilePicture}` : '');
        }
    }, [userDetails]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        if (imageFile) {
            formData.append('profilePicture', imageFile);
        }

            dispatch(updateUser({ id, userData: formData })).unwrap()
            .then(() => {
                navigate('/admin/dashboard');
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
        <div className="edit-user">
            <AdminSidebar />
            <ToastContainer />
            
            <form onSubmit={handleSubmit} className="edit-form">
            <h1>Edit User</h1>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="profilePicture">Profile Image</label>
                    <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {preview && <img src={preview} alt="Profile Preview" className="preview-image" />}
                </div>
                <button type="submit" className="btn-submit">Update User</button>
            </form>
        </div>
    );
};

export default EditUser;
