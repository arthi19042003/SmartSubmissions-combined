import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Welcome to Your Dashboard</h1>
        <p>Email: {user?.email}</p>

        <div className="dashboard-grid">
          <div className="card">
            <h3>Profile</h3>
            <p>Manage your personal information and work experience</p>
            <Link to="/profile" className="btn btn-primary">
              Edit Profile
            </Link>
          </div>

          <div className="card">
            <h3>Resume</h3>
            <p>Upload and manage your resume documents</p>
            <Link to="/resume" className="btn btn-primary">
              Manage Resume
            </Link>
          </div>

          <div className="card">
            <h3>Profile Completion</h3>
            {user?.profile?.firstName ? (
              <p className="success">Profile information added</p>
            ) : (
              <p className="error">Complete your profile to get started</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
