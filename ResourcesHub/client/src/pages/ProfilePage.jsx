import React, { useState } from "react";
import { useAuth } from "../utils/authContext";
import { Navigate, Link } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user?.bio || "",
    website: user?.website || "",
    interests: user?.interests || [],
    notifications: user?.notifications !== false,
  });

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Here you would update the user profile via API
    setIsEditing(false);
  };

  const handleToggleChange = (setting) => {
    setProfileData((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderOverviewTab = () => (
    <div className="profile-overview">
      <div className="profile-stats-container">
        <div className="profile-stat-card">
          <i className="fas fa-bookmark stat-icon"></i>
          <div className="stat-details">
            <h3>0</h3>
            <p>Bookmarked Resources</p>
          </div>
        </div>
        <div className="profile-stat-card">
          <i className="fas fa-share-alt stat-icon"></i>
          <div className="stat-details">
            <h3>0</h3>
            <p>Shared Resources</p>
          </div>
        </div>
        <div className="profile-stat-card">
          <i className="fas fa-thumbs-up stat-icon"></i>
          <div className="stat-details">
            <h3>0</h3>
            <p>Liked Resources</p>
          </div>
        </div>
      </div>

      <div className="recent-activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-timeline">
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-bookmark"></i>
            </div>
            <div className="activity-content">
              <p className="activity-text">
                You bookmarked <strong>Introduction to Machine Learning</strong>
              </p>
              <p className="activity-date">Just now</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <div className="activity-content">
              <p className="activity-text">
                You shared <strong>Advanced React Patterns</strong>
              </p>
              <p className="activity-date">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookmarksTab = () => (
    <div className="profile-bookmarks">
      <div className="bookmarks-header">
        <h2>My Bookmarked Resources</h2>
        <div className="bookmarks-filter">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Programming</button>
          <button className="filter-btn">Design</button>
          <button className="filter-btn">Business</button>
        </div>
      </div>

      <div className="resources-grid">
        {/* This would be populated with real bookmarks, 
            showing empty state when there are none */}
        <div className="empty-state">
          <i className="fas fa-bookmark empty-icon"></i>
          <h3>No bookmarks yet</h3>
          <p>Resources you bookmark will appear here for easy access</p>
          <Link to="/" className="btn-primary">
            <i className="fas fa-search"></i> Find Resources to Bookmark
          </Link>
        </div>
      </div>
    </div>
  );

  const renderSharedTab = () => (
    <div className="profile-shared">
      <div className="shared-header">
        <h2>Resources I've Shared</h2>
        <button className="share-new-btn">
          <i className="fas fa-plus"></i> Share New Resource
        </button>
      </div>

      <div className="resources-grid">
        {/* This would be populated with real shared resources, 
            showing empty state when there are none */}
        <div className="empty-state">
          <i className="fas fa-share-alt empty-icon"></i>
          <h3>No shared resources</h3>
          <p>You haven't shared any resources with the community yet</p>
          <button className="btn-primary">
            <i className="fas fa-plus"></i> Share Your First Resource
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="profile-settings">
      {isEditing ? (
        <form onSubmit={handleProfileUpdate} className="profile-edit-form">
          <h2>Edit Profile</h2>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              placeholder="Tell others about yourself..."
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="website">Website or Social Media Link</label>
            <input
              type="url"
              id="website"
              name="website"
              value={profileData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="interests">Interests (comma separated)</label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={
                Array.isArray(profileData.interests)
                  ? profileData.interests.join(", ")
                  : profileData.interests
              }
              onChange={handleInputChange}
              placeholder="programming, design, marketing"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              Save Changes
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleEditToggle}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <h2>Profile Information</h2>
          <div className="info-group">
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>
          <div className="info-group">
            <h3>Member Since</h3>
            <p>{formatDate(user.createdAt)}</p>
          </div>
          <div className="info-group">
            <h3>Bio</h3>
            <p>{profileData.bio || "No bio provided"}</p>
          </div>
          {profileData.website && (
            <div className="info-group">
              <h3>Website</h3>
              <p>
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profileData.website}
                </a>
              </p>
            </div>
          )}
          {profileData.interests && profileData.interests.length > 0 && (
            <div className="info-group">
              <h3>Interests</h3>
              <div className="interests-tags">
                {Array.isArray(profileData.interests) ? (
                  profileData.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="interest-tag">{profileData.interests}</span>
                )}
              </div>
            </div>
          )}
          <button className="btn-edit" onClick={handleEditToggle}>
            <i className="fas fa-edit"></i> Edit Profile
          </button>
        </div>
      )}

      <div className="preferences-section">
        <h2>Account Preferences</h2>
        <div className="toggle-option">
          <div>
            <h3>Email Notifications</h3>
            <p>Receive updates about new resources in your interests</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={profileData.notifications}
              onChange={() => handleToggleChange("notifications")}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="danger-zone">
          <h3>Account Actions</h3>
          <button className="btn-logout" onClick={logout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <button className="btn-danger">
            <i className="fas fa-trash-alt"></i> Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover-photo"></div>
        <div className="profile-header-content">
          <div className="profile-avatar">
            {user.username
              ? user.username.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
            <div className="avatar-edit">
              <i className="fas fa-camera"></i>
            </div>
          </div>
          <div className="profile-user-info">
            <h1>{user.username || user.email.split("@")[0]}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="joined-date">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => handleTabChange("overview")}
        >
          <i className="fas fa-user"></i> Overview
        </button>
        <button
          className={`profile-tab ${activeTab === "bookmarks" ? "active" : ""}`}
          onClick={() => handleTabChange("bookmarks")}
        >
          <i className="fas fa-bookmark"></i> Bookmarks
        </button>
        <button
          className={`profile-tab ${activeTab === "shared" ? "active" : ""}`}
          onClick={() => handleTabChange("shared")}
        >
          <i className="fas fa-share-alt"></i> Shared
        </button>
        <button
          className={`profile-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => handleTabChange("settings")}
        >
          <i className="fas fa-cog"></i> Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "bookmarks" && renderBookmarksTab()}
        {activeTab === "shared" && renderSharedTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </div>
    </div>
  );
};

export default ProfilePage;
