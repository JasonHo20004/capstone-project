
import express from 'express';
import cors from 'cors';

import userRouter from './modules/users/routes/user.route';
import adminRouter from './modules/admin/routes/admin.route';
import notificationRouter from './modules/notifications/routes/notification.route';
import authRouter from './modules/auth/routes/auth.route'
import flashcardDeckRouter from './modules/flashcards/routes/flashcardDeck.route'
import tagRouter from './modules/flashcards/routes/tag.route'
import flashcardRouter from './modules/flashcards/routes/flashcard.route'
import flashcardReviewRouter from './modules/flashcards/routes/flashcardReview.route'
import courseRouter from './modules/courses/routes/course.route'
import lessonRouter from './modules/courses/routes/lesson.route'
import testRouter from './modules/tests/routes/test.route'
import cartRouter from './modules/cart/routes/cart.route'
import topupOrderRouter from './modules/topupOrders/routes/topupOrder.route'
import reportRouter from './modules/reports/routes/report.route'
import practiceSessionRouter from './modules/practice_sessions/routes/practiceSession.route'

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
app.use('/api/notifications', notificationRouter);
app.use('/api/auth', authRouter)

app.use('/api/flashcardDecks',flashcardDeckRouter)
app.use('/api/tags',tagRouter)
app.use('/api/flashcards', flashcardRouter)
app.use('/api/flashcard-review',flashcardReviewRouter)

// Course Management Routes
app.use('/api/courses', courseRouter);
app.use('/api/courses', lessonRouter);
app.use('/api/tests', testRouter);

app.use('/api/topup-orders',topupOrderRouter)
app.use('/api/carts',cartRouter)
app.use('/api/reports',reportRouter)

// Practice session Routes
app.use('/api/practice-sessions',practiceSessionRouter)
export default app;