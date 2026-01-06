import express from 'express';
import { uploadArticleImage } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';
import commentRoutes from './comments.js';
import {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    publishArticle
} from '../controllers/articleController.js';

const router = express.Router();


router.get('/', getAllArticles);// Liste
router.get('/:id', getArticleById);// Un article
router.post('/', protect, uploadArticleImage, createArticle);// Création
router.put('/:id', protect, updateArticle);// Mise à jour
router.patch('/:id/publish', protect, publishArticle);
router.delete('/:id', protect, deleteArticle);

router.use('/:articleId/comments', commentRoutes);


export default router;