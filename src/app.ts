import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: 'https://loan-frontend-b1k4.onrender.com',
  credentials: true, 
};
app.use(cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express! From Divyanshu');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI ;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));


  
import loanRoutes from './routes/loanRoutes';
app.use('/api', loanRoutes);

import authRoutes from './routes/authRoutes';
app.use('/api/auth', authRoutes);
