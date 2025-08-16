import express from 'express';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../controllers/company.controller';
import { authorize, protect } from '../middlewares/auth';

const router = express.Router();

router.get('/', protect, getCompanies);
router.post('/', protect, authorize('admin'),createCompany);
router.put('/:id', protect, authorize('admin'),updateCompany);
router.delete('/:id', protect, authorize('admin'),deleteCompany);

export default router;
