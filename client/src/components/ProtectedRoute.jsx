import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../utils/axiosInstance";
import spinner from '/spinner.gif'

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` initially to represent loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/profile");
        setIsAuthenticated(true); // Authenticated if API call succeeds
      } catch (error) {
        setIsAuthenticated(false); // Not authenticated if API call fails
      }
    };
    checkAuth();
  }, []); // Runs once when the component mounts

  if (isAuthenticated === null) {
    // Show a loading indicator while checking authentication
    return (
      <div className="spinner">
            <img src={spinner} alt="" />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
