import express from 'express';
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/trip.controller';

import { protectAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/', protectAdmin, getTrips);
router.post('/', protectAdmin, createTrip);
router.put('/:id', protectAdmin, updateTrip);
router.delete('/:id', protectAdmin, deleteTrip);

export default router;
