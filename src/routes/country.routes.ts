import express from 'express';
import { createCountry, updateCountry, deleteCountry, getCountries } from '../controllers/country.controller';
import { authorize, protect } from '../middlewares/auth';
import { uploadCountryImages } from '../middlewares/uploadImage';

const router = express.Router();

router.get('/', protect, getCountries);
router.post('/', protect, authorize('admin'), uploadCountryImages.array('images', 10), createCountry);
router.put('/:id', protect, authorize('admin'), uploadCountryImages.array('images', 10), updateCountry);
router.delete('/:id', protect, authorize('admin'), deleteCountry);

export default router;