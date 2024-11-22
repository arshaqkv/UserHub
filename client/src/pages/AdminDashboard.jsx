import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { deleteUser, fetchAllUsers } from '../features/adminSlice';
import profile_image from '/profile.jpg';
import spinner from '/spinner.gif';
import Swal from 'sweetalert2';
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.admin);


    loading
    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);
    loading

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteUser = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUser(id));
                Swal.fire('Deleted!', 'The user has been deleted.', 'success');
            }
        });
    };


    return loading ? (
        <div className="spinner">
            <img src={spinner} alt="Loading..." />
        </div>
    ) : (
        <div className="admin-dashboard">
            <AdminSidebar />

            {/* Main Content */}
            <main className="main-content">
                <header>
                    <h1>User Management</h1>
                    <Link to={'/admin/create-user'} className='add-user-link'><IoPersonAdd className='icon'/>Add User</Link>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </header>

                <div className="user-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="profile-image">
                                            <img
                                                src={
                                                    user?.profilePicture
                                                        ? `http://localhost:3000/server${user.profilePicture}`
                                                        : profile_image
                                                }
                                                alt="Profile"
                                            />
                                        </td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Link
                                                to={`/admin/edit-user/${user._id}`}
                                                className="btn btn-edit"
                                            >
                                                <FaUserEdit className='icon'/>Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="btn btn-delete"
                                            >
                                                <MdDelete className='icon'/> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-users">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
