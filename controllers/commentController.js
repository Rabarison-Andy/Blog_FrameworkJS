const Comment = require('../models/Comment');
const Article = require('../models/Article');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../middleware/errorHandler');

// Create
exports.createComment = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    // Sécurité pour n'avoir les commentaires seulement que sur des articles publiés
    if (!Article.isPublished) {
        return next(
            new AppError('Commentaires désactivés sur cet article', 403)
        );
    }

    const comment = await Comment.create({
        commentairecontenu: req.body.commentairecontenu || req.body.contenu,
        auteurcommentaire: req.body.auteurcommentaire || req.body._id,
        article: articleId
    });

    res.status(201).json({
        success: true,
        message: 'Commentaire créé avec succès',
        data: comment
    });
});

//Read
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

exports.getCommentById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    
    if (!comment) {
        return next(new AppError('Commentaire non trouvé', 404));
    }

    res.status(200).json({
        success: true,
        data: comment
    });
});

exports.getApprovedCommentsByArticle = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;

    // Vérifier que l'article existe
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    const comments = await Comment.findApprouvesByArticle(articleId);

    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
    });
});

//Update
exports.updateComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    return next(new AppError('Commentaire non trouvé', 404));
  }

  // 🔐 Protection auteur
  if (comment.auteurcommentaire.toString() !== req.user._id.toString()) {
    return next(new AppError('Action non autorisée', 403));
  }

  comment.commentairecontenu =
    req.body.commentairecontenu || comment.commentairecontenu;

  await comment.save();

  res.status(200).json({
    success: true,
    message: 'Commentaire mis à jour avec succès',
    data: comment
  });
});


exports.approveComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    
    if (!comment) {
        return next(new AppError('Commentaire non trouvé', 404));
    }

    // Utiliser la méthode d'instance du modèle
    await comment.approuver();

    res.status(200).json({
        success: true,
        message: 'Commentaire approuvé avec succès',
        data: comment
    });
});

//Delete
exports.deleteComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    return next(new AppError('Commentaire non trouvé', 404));
  }

  // 🔐 Protection auteur
  if (comment.auteurcommentaire.toString() !== req.user._id.toString()) {
    return next(new AppError('Action non autorisée', 403));
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Commentaire supprimé avec succès'
  });
});

