const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['Candidate', 'Recruiter', 'Employer', 'Hiring Manager', 'Interviewer'],
    default: 'Candidate'
  },
  profile: {
    // Candidate fields
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    previousexperience: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    experience: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      description: String,
      current: Boolean
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      current: Boolean
    }],
    // Employer fields
    companyName: { type: String, default: '' },
    companyWebsite: { type: String, default: '' },
    companyPhone: { type: String, default: '' },
    companyAddress: { type: String, default: '' },
    organization: { type: String, default: '' },
    costCenter: { type: String, default: '' },
    department: { type: String, default: '' },
    projectSponsors: { type: String, default: '' },
    preferredCommunicationMode: { type: String, enum: ['Email', 'Phone', ''], default: '' },
    projects: [{ type: String }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);