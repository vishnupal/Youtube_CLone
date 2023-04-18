import express from 'express';
import dotenv from 'dotenv';
import { connect } from './config/database.js';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went Wrong';
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(3000, () => {
  connect();
  console.log('Connected to Server');
});
