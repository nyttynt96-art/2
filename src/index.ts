import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Import cron jobs
import './cron';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import tasksRoutes from './routes/tasks';
import referralsRoutes from './routes/referrals';
import withdrawalsRoutes from './routes/withdrawals';
import adminRoutes from './routes/admin';
import webhooksRoutes from './routes/webhooks';
import paymentMethodsRoutes from './routes/payment-methods';

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "https://static.cloudflareinsights.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.cloudflare.com"],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5177',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static files from dist (must be before routes)
app.use(express.static(path.join(__dirname, '../dist')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/tasks', authMiddleware, tasksRoutes);
app.use('/api/referrals', authMiddleware, referralsRoutes);
app.use('/api/withdrawals', authMiddleware, withdrawalsRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/payment-methods', paymentMethodsRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Serve React app for all other routes (must be last)
app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      logger.error('Error sending index.html:', err);
      res.status(404).json({ error: 'Not found' });
    }
  });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 PromoHive server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});

export default app;