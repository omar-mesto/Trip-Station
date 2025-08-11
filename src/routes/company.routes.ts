import express from 'express';
import { getCompanies,createCompany,updateCompany,deleteCompany } from '../controllers/company.controller';

import { protect } from '../middlewares/auth';

const router = express.Router();

router.get('/', protect, getCompanies);
router.post('/', protect, createCompany);
router.put('/:id', protect, updateCompany);
router.delete('/:id', protect, deleteCompany);

export default router;
