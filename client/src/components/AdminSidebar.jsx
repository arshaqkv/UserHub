import React from 'react'
import './AdminSidebar.css'
import { TbLogout2 } from "react-icons/tb";
import logo from '/userHub.webp'
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/authSlice';

const AdminSidebar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/admin');
    };
  return (
    <div>
        {/* Sidebar */}
        <aside className="sidebar">
            <div className="logo-div">
                <img src={logo} className='logo' alt="" />
                <h2>UserHub Admin</h2>
            </div>
            <ul className="menu">
                <li>
                    <Link to="/admin/dashboard" className="menu-item active">
                        <MdDashboard className='icon'/>Dashboard
                    </Link>
                </li>
                <li>
                    <button className="menu-item logout-btn" onClick={handleLogout}>
                        <TbLogout2 className='icon'/>Logout
                    </button>
                </li>
                
            </ul>
        </aside>
    </div>
  )
}

export default AdminSidebar
