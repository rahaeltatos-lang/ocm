import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/connection';
import { AppError } from '../middleware/errorHandler';

const router: Router = express.Router();

interface SignupBody {
  email: string;
  name: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body as SignupBody;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customerId = uuidv4();
    const verificationToken = uuidv4();

    await query(
      `INSERT INTO ocm_customers (id, email, name, password_hash, verification_token)
       VALUES ($1, $2, $3, $4, $5)`,
      [customerId, email, name, hashedPassword, verificationToken]
    );

    res.status(201).json({
      message: 'Signup successful. Please verify your email.',
      customerId,
      verificationToken // In production, send via email
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Verify Email
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { customerId, token } = req.body;

    if (!customerId || !token) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await query(
      `UPDATE ocm_customers
       SET email_verified = true, verification_token = NULL
       WHERE id = $1 AND verification_token = $2`,
      [customerId, token]
    );

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      `SELECT id, email, name, password_hash FROM ocm_customers WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const customer = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, customer.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: customer.id, email: customer.email },
      process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    res.json({
      token,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Password Reset Request
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await query(
      `UPDATE ocm_customers
       SET reset_token = $1, reset_token_expires = $2
       WHERE email = $3`,
      [resetToken, resetTokenExpires, email]
    );

    res.json({
      message: 'Password reset link sent (check email)',
      resetToken // In production, send via email only
    });
  } catch (error) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

// Confirm Password Reset
router.post('/confirm-reset', async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await query(
      `UPDATE ocm_customers
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
       WHERE email = $2 AND reset_token = $3 AND reset_token_expires > NOW()
       RETURNING id`,
      [hashedPassword, email, token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Reset confirmation failed' });
  }
});

export default router;
