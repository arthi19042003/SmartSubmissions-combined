const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const {
      // Candidate fields
      firstName, lastName, phone, address, city, state, zipCode,
      previousexperience, bio, skills, experience, education,
      // Employer fields
      companyName, companyWebsite, companyPhone, companyAddress, organization,
      costCenter, department, projectSponsors, preferredCommunicationMode, projects
    } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (phone !== undefined) user.profile.phone = phone;
    if (address !== undefined) user.profile.address = address;
    if (city !== undefined) user.profile.city = city;
    if (state !== undefined) user.profile.state = state;
    if (zipCode !== undefined) user.profile.zipCode = zipCode;
    if (previousexperience !== undefined) user.profile.previousexperience = previousexperience;
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) user.profile.skills = skills;
    if (experience !== undefined) user.profile.experience = experience;
    if (education !== undefined) user.profile.education = education;

    // Update employer-specific fields
    if (companyName !== undefined) user.profile.companyName = companyName;
    if (companyWebsite !== undefined) user.profile.companyWebsite = companyWebsite;
    if (companyPhone !== undefined) user.profile.companyPhone = companyPhone;
    if (companyAddress !== undefined) user.profile.companyAddress = companyAddress;
    if (organization !== undefined) user.profile.organization = organization;
    if (costCenter !== undefined) user.profile.costCenter = costCenter;
    if (department !== undefined) user.profile.department = department;
    if (projectSponsors !== undefined) user.profile.projectSponsors = projectSponsors;
    if (preferredCommunicationMode !== undefined) user.profile.preferredCommunicationMode = preferredCommunicationMode;
    if (projects !== undefined) user.profile.projects = projects;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add experience
router.post('/experience', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.profile.experience.push(req.body);
    await user.save();
    res.json(user.profile.experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update experience
router.put('/experience/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const experience = user.profile.experience.id(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    Object.assign(experience, req.body);
    await user.save();
    res.json(user.profile.experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete experience
router.delete('/experience/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.profile.experience.pull(req.params.id);
    await user.save();
    res.json(user.profile.experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add education
router.post('/education', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.profile.education.push(req.body);
    await user.save();
    res.json(user.profile.education);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update education
router.put('/education/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const education = user.profile.education.id(req.params.id);

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    Object.assign(education, req.body);
    await user.save();
    res.json(user.profile.education);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete education
router.delete('/education/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.profile.education.pull(req.params.id);
    await user.save();
    res.json(user.profile.education);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;