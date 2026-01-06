import { Article } from "../models/Article.js";
import AppError from "../utils/AppError.js"
import QueryFeatures from "../utils/queryFeatures.js";
import { catchAsync } from "../middleware/errorHandler.js"

// CREATE

/**
 * @desc    Récupérer tous les articles
 * @route   GET /api/articles
 * @access  Public
 */
const createArticle = catchAsync(async (req, res, next) => {
  const { title, content, categorie } = req.body;

  const article = new Article({
	title,
	content,
  author: req.user._id,
	categorie,
  image: req.file ? req.file.path : null,
  });

  const articleSauvegarde = await article.save();

  res.status(201).json({
	success: true,
	message: "Article créé avec succès",
	data: articleSauvegarde,
  });
});

// READ

const getAllArticles = catchAsync(async (req, res, next) => {
  const totalCount = await Article.countDocuments();

  const features = new QueryFeatures(Article.find({ isPublished: true }), req.query)
	.filter()
	.search()
	.sort()
	.limitFields()
	.paginate();

  const articles = await features.query;

  const paginationInfo = features.getPaginationInfo === 'function'
  ? features.getPaginationInfo(totalCount)
  : null;;

  const response = {
	success: true,
	count: articles.length,
	totalCount: totalCount,
	data: articles
  };

  if (paginationInfo) {
	  response.pagination = paginationInfo;
  }

  res.status(200).json(response);
});

const getArticleById = catchAsync(async (req, res, next) => {
    const article = await Article.findById(req.params.id)
     .populate('author', 'nom email');

    if (!article) {
      return next(new AppError('Article non trouvé', 404));
    }

    await article.incrementViews();

    res.status(200).json({ success: true, data: article });
});

// UPDATE

const updateArticle = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Récupérer l'article d'abord pour vérifier l'auteur
  const existing = await Article.findById(id);
  if (!existing) {
    return next(new AppError('Article non trouvé', 404));
  }

  // Protection Auteur
  if (!existing.author || existing.author.toString() !== req.user._id.toString()) {
    return next(new AppError('Action non autorisée', 403));
  }

  const updates = { ...req.body };
  if (req.file) {
    updates.image = req.file.path;
  }

  const article = await Article.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!article) {
    return next(new AppError('Article non trouvé', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Article mis à jour avec succès',
    data: article
  });
});

// DELETE
const deleteArticle = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Récupérer l'article pour vérifier l'auteur avant suppression
  const existing = await Article.findById(id);
  if (!existing) {
    return next(new AppError('Article non trouvé', 404));
  }

  // Protection Auteur
  if (!existing.author || existing.author.toString() !== req.user._id.toString()) {
    return next(new AppError('Action non autorisée', 403));
  }

  const article = await Article.findByIdAndDelete(id);

  if (!article) {
    return next(new AppError('Article non trouvé', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Article supprimé avec succès',
    data: article
  });
});

const publishArticle = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const article = await Article.findById(id);
  if (!article) {
    return next(new AppError('Article non trouvé', 404));
  }

  // Protection Auteur
  if (article.author.toString() !== req.user._id.toString()) {
    return next(new AppError('Action non autorisée', 403));
  }

  // Toggle publication
  article.isPublished = !article.isPublished;
  await article.save();

  res.status(200).json({
    success: true,
    message: article.isPublished
      ? 'Article publié avec succès'
      : 'Article repassé en brouillon',
    data: article
  });
});



export {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  publishArticle
};