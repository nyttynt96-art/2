import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get active payment methods (for users)
router.get('/active', asyncHandler(async (req, res) => {
  const paymentMethods = await prisma.paymentMethod.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  res.json({
    success: true,
    paymentMethods,
  });
}));

// Get all payment methods (for admin)
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const paymentMethods = await prisma.paymentMethod.findMany({
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    paymentMethods,
  });
}));

// Create payment method (admin only)
const createPaymentMethodSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  address: z.string().min(1),
  network: z.string().optional(),
  qrCode: z.string().url().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

router.post('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const data = createPaymentMethodSchema.parse(req.body);

  const paymentMethod = await prisma.paymentMethod.create({
    data,
  });

  logger.info(`Payment method created: ${paymentMethod.name} by ${req.user?.email}`);

  res.status(201).json({
    success: true,
    message: 'Payment method created successfully',
    paymentMethod,
  });
}));

// Update payment method (admin only)
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const data = createPaymentMethodSchema.partial().parse(req.body);

  const paymentMethod = await prisma.paymentMethod.update({
    where: { id },
    data,
  });

  logger.info(`Payment method updated: ${paymentMethod.name} by ${req.user?.email}`);

  res.json({
    success: true,
    message: 'Payment method updated successfully',
    paymentMethod,
  });
}));

// Delete payment method (admin only)
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  await prisma.paymentMethod.delete({
    where: { id },
  });

  logger.info(`Payment method deleted: ${id} by ${req.user?.email}`);

  res.json({
    success: true,
    message: 'Payment method deleted successfully',
  });
}));

export default router;

