import express from 'express';

const router = express.Router()
const {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} = require('../controllers/articleController');


router.get('/', getAllArticles);// Liste
router.get('/:id', getArticleById);// Un article
router.post('/', createArticle);// Création
router.put('/:id', updateArticle);// Mise à jour
router.patch('/:id/publish', publishArticle);
router.delete('/:id', deleteArticle);


export default router;