import { Article } from "../models/Article";
import { QueryFeatures } from "../utils/queryFeatures";

// CREATE

/**
 * @desc    Récupérer tous les articles
 * @route   GET /api/articles
 * @access  Public
 */
async function createArticle(req, res) {
  try {
    const { titre, contenu, auteur, categorie } = req.body;

    const article = new Article({
      titre,
      contenu,
      auteur,
      categorie,
    });

    const articleSauvegarde = await article.save();

    res.status(201).json({
      success: true,
      message: "Article créé avec succès",
      data: articleSauvegarde,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        succes: false,
        message: "Erreur de validation",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de l'article",
      error: error.message,
    });
  }
}

// READ

async function getAllArticles(req, res) {
  try {
	const totalCount = await Article.countDocuments();

	const features = new QueryFeatures(Article.find(), req.query)
		.filter()
		.search()
		.sort()
		.limitFields()
		.paginate();

	const articles = await features.query;

	const paginationInfo = features.getPaginationInfo(totalCount);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des articles",
      error: error.message,
    });
  }
}

async function getArticleById(req, res) {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    await article.incrementerVues();

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "ID d'article invalide"
      });

    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'article",
      error: error.message,
    });
  }
}

// UPDATE

async function updateArticle(req, res) {

    try {
        const { id } = req.params;

        const article = await Article.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,              // Retourne le document modifié
                runValidators: true     // Exécute les validations
            }
        );

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article mis à jour avec succès',
            data: article
        });

    } catch (error) {

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "ID d'article invalide"
      });

      

    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        succes: false,
        message: "Erreur de validation",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
    success: false,
    message: 'Erreur lors de la mise à jour',
    error: error.message
    });

    }
    
}

// DELETE
async function deleteArticle(req, res) {
        try {
        const { id } = req.params;

        const article = await Article.findByIdAndDelete(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article supprimé avec succès',
            data: article
        });

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID d\'article invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
            error: error.message
        });
    }

}

module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
};