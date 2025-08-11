import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import countryRoutes from './routes/country.routes';
import companyRoutes from './routes/company.routes';
import tripRoutes from './routes/trip.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { setLang } from './middlewares/setLang';

dotenv.config();
const app = express();

app.use(helmet());
app.use(setLang);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/auth', authRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running ${PORT}`));
});