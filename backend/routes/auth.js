const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit faire entre 2 et 50 caract\u00e8res')
    .matches(/^[a-zA-Z\u00C0-\u024F\s\-']+$/).withMessage('Le nom contient des caract\u00e8res invalides'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email trop long'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit faire au moins 8 caract\u00e8res')
    .isLength({ max: 128 }).withMessage('Le mot de passe est trop long')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ max: 128 }).withMessage('Mot de passe invalide'),
];

// Helper: format validation errors
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  return null;
};

// POST /api/auth/register
router.post('/register', registerValidation, async (req, res) => {
  try {
    const validationError = handleValidation(req, res);
    if (validationError) return;

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe d\u00e9j\u00e0',
      });
    }

    // Hash password with cost factor 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Compte cr\u00e9\u00e9 avec succ\u00e8s',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('[Register Error]', error.message);
    res.status(500).json({ success: false, message: 'Erreur lors de la cr\u00e9ation du compte' });
  }
});

// POST /api/auth/login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const validationError = handleValidation(req, res);
    if (validationError) return;

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Generic error message (don't reveal if email exists)
    const authError = { success: false, message: 'Email ou mot de passe incorrect' };
    if (!user) return res.status(401).json(authError);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json(authError);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion r\u00e9ussie',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('[Login Error]', error.message);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
  }
});

module.exports = router;
