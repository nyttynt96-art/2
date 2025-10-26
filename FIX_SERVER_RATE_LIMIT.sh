#!/bin/bash

echo "===================================="
echo "🔧 إصلاح إعدادات Rate Limit"
echo "===================================="

cd /var/www/promohive

# 1. تحديث الكود
echo "1️⃣ تحديث الكود من Git..."
git pull origin main

# 2. تعديل index.ts
echo "2️⃣ تعديل إعدادات Rate Limit..."
cat > src/index.ts << 'EOL'
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

// Configure trust proxy for rate limiting
app.set('trust proxy', 1);

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

// CORS setup
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5177',
  credentials: true,
}));

// Rate limiting configuration with custom key generation
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Get client IP with proxy support
    const realIP = req.headers['x-real-ip'] || 
                  req.headers['x-client-ip'] ||
                  (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null) ||
                  req.connection.remoteAddress ||
                  req.socket.remoteAddress;
    
    return realIP || 'unknown';
  },
  skip: (req) => {
    // Skip rate limiting for health checks and webhooks
    return req.path === '/health' || req.path.startsWith('/api/webhooks');
  }
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/tasks', authMiddleware, tasksRoutes);
app.use('/api/referrals', authMiddleware, referralsRoutes);
app.use('/api/withdrawals', authMiddleware, withdrawalsRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/payment-methods', paymentMethodsRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Serve static files
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Serve React app for all other routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;
EOL

# 3. إعادة البناء
echo "3️⃣ إعادة بناء التطبيق..."
npm run build

# 4. إعادة تشغيل الخادم
echo "4️⃣ إعادة تشغيل PM2..."
pm2 restart promohive-server

# 5. حفظ التكوين
echo "5️⃣ حفظ تكوين PM2..."
pm2 save

# 6. عرض السجلات للتحقق
echo ""
echo "6️⃣ التحقق من السجلات..."
sleep 3
pm2 logs promohive-server --lines 30 --nostream

echo ""
echo "✅ تم إصلاح Rate Limit بنجاح!"
echo "===================================="