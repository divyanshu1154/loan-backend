import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { UserRole } from '../models/User';

const router = Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

// Register User (Regular)
router.post('/register', async (req: Request, res: Response) => { 
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email is already registered' });
    }else{
      const newUser = new User({
        name,
        email,
        password,
        role: 'user',
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Register Admin
router.post('/admin/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      res.status(400).json({ error: 'Email is already registered' });
    }else{
          const newAdmin = new User({
            name,
            email,
            password,
            role: UserRole.Admin,
          });
      
          await newAdmin.save();
          res.status(201).json({ message: 'Admin registered successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// User or Admin Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
    }else{
      const isValidPassword = await user.isPasswordValid(password);
      if (!isValidPassword) {
        res.status(400).json({ error: 'Invalid email or password' });
      }else{
        // Create JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1m' });
        
        // Set cookie with token
        res.cookie('token', token, {
          httpOnly: true,  
          secure: true, 
          sameSite: 'none', 
        });
        res.status(200).json({ message: 'Login successful', token });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});
  
export default router;
