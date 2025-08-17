import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/db';

import adminRoutes from './routes/admin.routes';
import countryRoutes from './routes/country.routes';
import companyRoutes from './routes/company.routes';
import tripRoutes from './routes/trip.routes';
import authRoutes from './routes/auth.routes';
import favoriteRoutes from './routes/favorite.routes';

import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/healthz', (_, res) => res.status(200).send('ok'));

app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorite',favoriteRoutes)

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect DB:', err);
    process.exit(1);
  }
};

startServer();
