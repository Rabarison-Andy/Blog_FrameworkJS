import express from 'express';
// mergeParams: true permet d'accéder à articleId du parent
const router = express.Router({ mergeParams: true });

const {
    createComment,
    getCommentsByArticle,
    getApprovedComments
} = require('../controllers/commentController');

// /api/articles/:articleId/comments
router.route('/')
    .get(getCommentsByArticle)
    .post(createComment);

// /api/articles/:articleId/comments/approuves
router.get('/approuves', getApprovedComments);

module.exports = router;
