const Comment = require('../models/Comment');
const Article = require('../models/Article');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../middleware/errorHandler');

exports.createComment = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    const comment = await Comment.create({
        contenu: req.body.contenu,
        auteur: req.body.auteur,
        article: articleId
    });

    res.status(201).json({
        success: true,
        message: 'Commentaire créé avec succès',
        data: comment
    });
});

exports.getCommentsByArticle = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    const comments = await Comment.find({ article: articleId })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
    });
});
