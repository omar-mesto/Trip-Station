import express from 'express';
import { getCountries,createCountry,updateCountry,deleteCountry } from '../controllers/country.controller';

const router = express.Router();

router.get('/', getCountries);
router.post('/', createCountry);
router.put('/:id', updateCountry);
router.delete('/:id', deleteCountry);

export default router;
