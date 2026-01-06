import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createComment,
    getCommentsByArticle,
    getApprovedCommentsByArticle,
    approveComment
} from '../controllers/commentController.js';
// mergeParams: true permet d'accéder à articleId du parent
const router = express.Router({ mergeParams: true });

// /api/articles/:articleId/comments
router.route('/')
    .get(getCommentsByArticle)
    .post(protect, createComment);

// /api/articles/:articleId/comments/approuves
router.get('/approuves', getApprovedCommentsByArticle);

export default router;
