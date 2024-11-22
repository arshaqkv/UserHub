import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logoutUser, updateProfilePicture } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import profile_image from '/profile.jpg'; // Default profile image if none is available
import './Profile.css'; // Importing the external CSS file
import {ToastContainer } from 'react-toastify';
import { showToast } from '../utils/toastUtils';
import spinner from '/spinner.gif'


const Profile = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);  
  const dispatch = useDispatch();
  const { user, loading, message } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const handleUpload = () => {
    loading
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      dispatch(updateProfilePicture(formData)).unwrap()
      .then(() => {
          // Show success toast
         showToast('success', message)
         setUploading(false)
      })
      .catch((error) => {
          // Show error toast if login fails
          showToast('error', error)
      });
      loading
    }else{
      showToast('error', 'Select file')
    }
    
  };

  

  return (
    <div className='home'>
      <div className='logo-div'> 
        <h1>UserHub</h1>
      </div>
      <div className="profile-container"> 
        <ToastContainer />
        {loading ? (
          <div className="spinner">
            <img src={spinner} alt="" />
          </div>
        ) : (
          <div className="profile-card">
            <div className="profile-img-container">
              <img
                src={user?.profilePicture ? `http://localhost:3000/server${user.profilePicture}` : profile_image}
                alt="Profile"
                className="profile-img"
              />
            </div>
            <h1 className="profile-username">Welcome, {user?.username}</h1>
            <p className="profile-email">Email: {user?.email}</p>

            <div className="upload-section">
              <input type="file" className="file-input" onChange={handleFileChange} />
              <button className="upload-btn" onClick={handleUpload} disabled={uploading || !file}>
                {uploading ? 'Uploading...' : (user?.profilePicture ? 'Change Profile Picture' : 'Upload Profile Picture')}

              </button>
            </div>

            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
