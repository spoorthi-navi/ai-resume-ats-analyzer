import express from 'express';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadResume, getMyResumes, analyzeResume, getResumeById } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);
router.get('/my-resumes', authMiddleware, getMyResumes);
router.post('/analyze', authMiddleware, analyzeResume);
router.get('/:id', authMiddleware, getResumeById);

export default router;