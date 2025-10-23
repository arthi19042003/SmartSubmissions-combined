const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Register Candidate
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({ email, password, role: 'Candidate' });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        token,
        user: { id: user._id, email: user.email, profile: user.profile, role: user.role }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Register Employer
router.post(
  '/register/employer',
  [
    body('hiringManagerEmail').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('hiringManagerFirstName').notEmpty().withMessage('First name is required'),
    body('hiringManagerLastName').notEmpty().withMessage('Last name is required'),
    body('hiringManagerPhone').notEmpty().withMessage('Phone number is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        companyName,
        hiringManagerFirstName,
        hiringManagerLastName,
        hiringManagerEmail,
        hiringManagerPhone,
        password
      } = req.body;

      let user = await User.findOne({ email: hiringManagerEmail });
      if (user) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      user = new User({
        email: hiringManagerEmail,
        password,
        role: 'Employer',
        profile: {
          companyName,
          firstName: hiringManagerFirstName,
          lastName: hiringManagerLastName,
          phone: hiringManagerPhone,
        }
      });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        token,
        user: { id: user._id, email: user.email, profile: user.profile, role: user.role }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: { id: user._id, email: user.email, profile: user.profile, role: user.role }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;