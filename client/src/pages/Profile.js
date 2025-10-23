import React from 'react';
import { useAuth } from '../context/AuthContext';
import CandidateProfile from './CandidateProfile';
import EmployerProfile from './EmployerProfile';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="container">
      {user.role === 'Employer' ? <EmployerProfile /> : <CandidateProfile />}
    </div>
  );
};

export default Profile;