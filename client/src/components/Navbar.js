import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Smart Submissions
        </Link>
        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/profile" className="navbar-link">Profile</Link>
              {user.role === 'Candidate' && (
                <Link to="/resume" className="navbar-link">Resume</Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;