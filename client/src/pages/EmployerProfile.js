import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css'; // Reusing some styles from Profile.css

const EmployerProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    companyPhone: '',
    companyAddress: '',
    organization: '',
    costCenter: '',
    department: '',
    projectSponsors: '',
    preferredCommunicationMode: '',
    projects: '' // Using a string for simple comma-separated input
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        companyName: user.profile.companyName || '',
        companyWebsite: user.profile.companyWebsite || '',
        companyPhone: user.profile.companyPhone || '',
        companyAddress: user.profile.companyAddress || '',
        organization: user.profile.organization || '',
        costCenter: user.profile.costCenter || '',
        department: user.profile.department || '',
        projectSponsors: user.profile.projectSponsors || '',
        preferredCommunicationMode: user.profile.preferredCommunicationMode || '',
        projects: (user.profile.projects || []).join(', ')
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        projects: formData.projects.split(',').map(p => p.trim()).filter(Boolean)
      };
      const response = await axios.put('/api/profile', payload);

      updateUser(response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Edit Company Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2>Company Information</h2>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Company Website</label>
            <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Company Phone</label>
            <input type="tel" name="companyPhone" value={formData.companyPhone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Company Address & Location</label>
            <textarea name="companyAddress" value={formData.companyAddress} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Preferred Communication Mode</label>
            <select name="preferredCommunicationMode" value={formData.preferredCommunicationMode} onChange={handleChange}>
              <option value="">Select a mode</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
            </select>
          </div>
        </div>
        <div className="card">
          <h2>Organizational Details</h2>
          <div className="form-group">
            <label>Organization</label>
            <input type="text" name="organization" value={formData.organization} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cost Center</label>
            <input type="text" name="costCenter" value={formData.costCenter} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} />
          </div>
           <div className="form-group">
            <label>Project Sponsors</label>
            <input type="text" name="projectSponsors" value={formData.projectSponsors} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Projects (comma-separated)</label>
            <input type="text" name="projects" value={formData.projects} onChange={handleChange} />
          </div>
        </div>

        {message.text && (
          <div className={message.type === 'success' ? 'success' : 'error'}>
            {message.text}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default EmployerProfile;