
import express from 'express';
import cors from 'cors';

import userRouter from './modules/users/routes/user.route';
import adminRouter from './modules/admin/routes/admin.route';
import authRouter from './modules/auth/routes/auth.route'
import cookieParser from 'cookie-parser'; // Import cookie-parser

// Create Express app instance
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // ✅ Use the middleware

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Backend server is running!' });
});
// Modular Routes
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter)
export default app;