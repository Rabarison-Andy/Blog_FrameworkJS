import { Comment } from '../models/Comment.js';
import { Article } from '../models/Article.js';
import AppError from "../utils/AppError.js";
import { catchAsync } from '../middleware/errorHandler.js';

export const createComment = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    // Sécurité pour n'avoir les commentaires seulement que sur des articles publiés
    if (!article.isPublished) {
        return next(
            new AppError('Commentaires désactivés sur cet article', 403)
        );
    }

    const comment = await Comment.create({
        commentairecontenu: req.body.commentairecontenu || req.body.contenu,
        auteurcommentaire: req.user._id,
        article: articleId
    });

    res.status(201).json({
        success: true,
        message: 'Commentaire créé avec succès',
        data: comment
    });
});

export const getCommentsByArticle = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;
    const articleExists = await Article.exists({ _id: articleId });
    if (!articleExists) {
        return next(new AppError('Article non trouvé', 404));
    }

    const comments = await Comment.find({ article: articleId })
        .sort({ createdAt: -1 })
        .populate('auteurcommentaire', 'nom');

    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
    });
});

export const getCommentById = catchAsync(async (req, res, next) => {
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

export const getApprovedCommentsByArticle = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;

    // Vérifier que l'article existe
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    const comments = await Comment.find({ article: articleId, approuve: true }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
    });
});

export const updateComment = catchAsync(async (req, res, next) => {
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


export const approveComment = catchAsync(async (req, res, next) => {
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

export const deleteComment = catchAsync(async (req, res, next) => {
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

