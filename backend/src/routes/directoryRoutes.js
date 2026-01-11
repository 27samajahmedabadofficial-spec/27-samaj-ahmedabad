import express from 'express';
import { getDirectoryMembers, getFamilyDetails } from '../controllers/directoryController.js';

const router = express.Router();

// Public routes
router.get('/members', getDirectoryMembers);
router.get('/members/:familyId', getFamilyDetails);

export default router;
