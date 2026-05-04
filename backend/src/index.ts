import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import roomRoutes from './routes/rooms';
import reservationRoutes from './routes/reservations';
import paymentRoutes from './routes/payments';
import taskRoutes from './routes/tasks';
import staffRoutes from './routes/staff';
import pricingRoutes from './routes/pricing';
import housekeepingRoutes from './routes/housekeeping';
import inventoryRoutes from './routes/inventory';
import mediaRoutes from './routes/media';
import contactRoutes from './routes/contact';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3002', 10);

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏨 Citadel Hotel API running on port ${PORT}`);
});

export default app;