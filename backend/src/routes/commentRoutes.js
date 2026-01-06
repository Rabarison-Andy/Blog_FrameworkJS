import express from 'express';
import { protect } from '../middleware/auth.js';
import { approveComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.patch('/:id/approve', protect, approveComment);

router.delete('/:id', protect, deleteComment);

export default router;