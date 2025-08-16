import express from 'express';
import {
  getTrips,
  getTripDetails,
  filterTrips,
  nearbyTrips,
  getLocalAdsTrips,
  getInternationalAdsTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getLocalTrips,
  getInternationalTrips,
  setTripAsAdvertisement,
  removeTripFromAdvertisement
} from '../controllers/trip.controller';
import { authorize, protect } from '../middlewares/auth';
import { uploadTripImages } from '../middlewares/uploadImage';

const router = express.Router();

router.get('/', protect, authorize('admin'), getTrips);
router.post('/', protect, authorize('admin'), uploadTripImages.array('images', 10), createTrip);

router.get('/local', protect, getLocalTrips);
router.get('/international', protect, getInternationalTrips);

router.post('/filter', protect, filterTrips);
router.get('/nearby', protect, nearbyTrips);

router.get('/ads/local', protect, getLocalAdsTrips);
router.get('/ads/international', protect, getInternationalAdsTrips);

router.put('/:id', protect, authorize('admin'), uploadTripImages.array('images', 10), updateTrip);
router.delete('/:id', protect, authorize('admin'), deleteTrip);

router.put('/advertise/:id', protect, authorize('admin'), setTripAsAdvertisement);
router.put('/unadvertise/:id', protect, authorize('admin'), removeTripFromAdvertisement);

router.get('/:id', protect, getTripDetails);


export default router;
