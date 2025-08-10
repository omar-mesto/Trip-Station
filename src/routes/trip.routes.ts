import express from 'express';
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  updateTripAdvertisement,
  getAdvertisementTrips
} from '../controllers/trip.controller';

import { protectAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/', protectAdmin, getTrips);
router.post('/', protectAdmin, createTrip);
router.put('/:id', protectAdmin, updateTrip);
router.delete('/:id', protectAdmin, deleteTrip);
router.put("/advertisement/:id", updateTripAdvertisement);
router.get("/advertisement", getAdvertisementTrips);

export default router;
