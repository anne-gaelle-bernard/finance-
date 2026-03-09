const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir une adresse email'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.json({
        success: true,
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // Build reset URL
    const clientURL = process.env.CLIENT_URL || 'https://finance-tracker-one-gamma.vercel.app';
    const resetURL = `${clientURL}/reset-password/${resetToken}`;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: `"Finance Tracker" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe - Finance Tracker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ec4899;">🔒 Réinitialisation du mot de passe</h2>
          <p>Bonjour <strong>${user.name}</strong>,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Ce lien expire dans <strong>30 minutes</strong>.</p>
          <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Finance Tracker - Gérez vos finances en toute simplicité</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
    });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Lien invalide ou expiré. Veuillez refaire une demande.'
      });
    }

    // Update password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;
