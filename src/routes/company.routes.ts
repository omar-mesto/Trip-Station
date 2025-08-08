import express from 'express';
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/company.controller';

import { protectAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/', protectAdmin, getCompanies);
router.post('/', protectAdmin, createCompany);
router.put('/:id', protectAdmin, updateCompany);
router.delete('/:id', protectAdmin, deleteCompany);

export default router;
