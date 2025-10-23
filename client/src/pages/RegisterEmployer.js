import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterEmployer = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    hiringManagerFirstName: '',
    hiringManagerLastName: '',
    hiringManagerEmail: '',
    hiringManagerPhone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerEmployer } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await registerEmployer(formData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Employer Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name *</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hiring Manager First Name *</label>
          <input type="text" name="hiringManagerFirstName" value={formData.hiringManagerFirstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hiring Manager Last Name *</label>
          <input type="text" name="hiringManagerLastName" value={formData.hiringManagerLastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hiring Manager Email *</label>
          <input type="email" name="hiringManagerEmail" value={formData.hiringManagerEmail} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hiring Manager Phone *</label>
          <input type="tel" name="hiringManagerPhone" value={formData.hiringManagerPhone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password *</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Confirm Password *</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterEmployer;