import express from 'express';
import { getTrips,createTrip,updateTrip,deleteTrip,updateTripAdvertisement,getAdvertisementTrips } from '../controllers/trip.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.get('/', protect, getTrips);
router.post('/', protect, createTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);
router.put("/advertisement/:id", updateTripAdvertisement);
router.get("/advertisement", getAdvertisementTrips);

export default router;
