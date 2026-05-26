const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const store = require('../config/store');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
    expiresIn: '30d',
  });
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password, role, adminLevel, adminRegion, country, state, district, block, panchayat, village } = req.body;

  try {
    if (!name || !email || !password || !state || !district || !block || !panchayat || !village) {
      return res.status(400).json({ message: 'Please include name, email, password and full location details.' });
    }

    const userExists = await store.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await store.createUser({
      name,
      email,
      password,
      role,
      adminLevel,
      adminRegion,
      country,
      state,
      district,
      block,
      panchayat,
      village
    });

    if (user) {
      return res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please include email and password' });
    }

    const user = await store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get profile
const getUserProfile = async (req, res) => {
  try {
    const user = await store.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verificationCount = await store.countVerificationsByUserId(req.user.id);
    const verifications = await store.findVerificationsByUserId(req.user.id);

    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminLevel: user.adminLevel,
      adminRegion: user.adminRegion,
      country: user.country,
      state: user.state,
      district: user.district,
      block: user.block,
      panchayat: user.panchayat,
      village: user.village,
      createdAt: user.createdAt,
      verificationCount,
      activity: verifications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update profile
const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const updatedUser = await store.updateUser(req.user.id, { name, email, password });

    if (updatedUser) {
      return res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser.id),
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
