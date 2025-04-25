import React from "react";
import { useAuth } from "../utils/authContext";
import { Navigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="profile-loading">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.username ? user.username.charAt(0).toUpperCase() : "U"}
        </div>
        <h1>{user.username || "User"}</h1>
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="profile-details">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="profile-info-item">
            <span className="info-label">Role:</span>
            <span className="info-value">{user.role || "User"}</span>
          </div>
          <div className="profile-info-item">
            <span className="info-label">Account Created:</span>
            <span className="info-value">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
