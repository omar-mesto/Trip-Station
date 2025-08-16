import express from 'express';
import { getCountries,createCountry,updateCountry,deleteCountry } from '../controllers/country.controller';
import { authorize, protect } from '../middlewares/auth';

const router = express.Router();

router.get('/', protect,getCountries);
router.post('/',protect,authorize('admin'), createCountry);
router.put('/:id',protect,authorize('admin'), updateCountry);
router.delete('/:id',protect,authorize('admin'), deleteCountry);

export default router;
