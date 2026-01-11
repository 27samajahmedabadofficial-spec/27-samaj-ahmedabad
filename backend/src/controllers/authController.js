import pool from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { validateRegistrationInput, validateLoginInput } from '../utils/validation.js';
import { generateToken } from '../utils/jwt.js';

// REGISTER CONTROLLER
export const register = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;

    // Validate input
    const validation = validateRegistrationInput(mobileNo, password);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE mobile_no = ?',
      [mobileNo]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Mobile number already registered',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (mobile_no, password) VALUES (?, ?)',
      [mobileNo, hashedPassword]
    );

    const userId = result.insertId;

    // Get inserted user
    const [users] = await pool.query(
      'SELECT id, mobile_no, is_profile_complete, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = users[0];

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          mobileNo: user.mobile_no,
          isProfileComplete: user.is_profile_complete,
          createdAt: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;

    // Validate input
    const validation = validateLoginInput(mobileNo, password);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Find user by mobile number
    const [users] = await pool.query(
      'SELECT * FROM users WHERE mobile_no = ?',
      [mobileNo]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile number or password',
      });
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile number or password',
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          mobileNo: user.mobile_no,
          isProfileComplete: user.is_profile_complete,
          createdAt: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.query(
      'SELECT id, mobile_no, is_profile_complete, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        mobileNo: user.mobile_no,
        isProfileComplete: user.is_profile_complete,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mobileNo, isProfileComplete } = req.body;

    // Update profile
    await pool.query(
      'UPDATE users SET mobile_no = COALESCE(?, mobile_no), is_profile_complete = COALESCE(?, is_profile_complete), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [mobileNo || null, isProfileComplete !== undefined ? isProfileComplete : null, userId]
    );

    // Get updated user
    const [users] = await pool.query(
      'SELECT id, email, mobile_no, is_profile_complete, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        email: user.email,
        mobileNo: user.mobile_no,
        isProfileComplete: user.is_profile_complete,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// LOGOUT (just for API completeness, actual logout happens on frontend)
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

// GET CURRENT USER (me endpoint)
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // First check if user has a family profile
    const [families] = await pool.query(
      'SELECT full_name FROM families WHERE user_id = ? LIMIT 1',
      [userId]
    );

    // Get user data
    const [users] = await pool.query(
      'SELECT id, mobile_no, is_profile_complete, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = users[0];
    const userName = families.length > 0 ? families[0].full_name : `User ${user.id}`;

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: userName,
        mobileNo: user.mobile_no,
        isProfileComplete: user.is_profile_complete,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
