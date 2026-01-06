import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
    commentairecontenu: {
            type: String,
            required: [true, 'Le contenu est obligatoire'],
            trim: true,
            maxlength: [1000, 'Maximum 1000 caractères']
        },

    auteurcommentaire: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Auteur obligatoire'],
            trim: true,
            maxlength: [100, 'Maximum 100 caractères']
        },
    article: {
            type: mongoose.Schema.Types.ObjectId, // Type: ID MongoDB
            ref: 'Article', //Référence au modèle Article
            required: [true, 'Article obligatoire']
        },
    approuve: {
            type: Boolean,
            default: false
        },
    signale: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);

// INDEX pour optimiser les requêtes
// MongoDB utilise l'index pour trouver rapidement
commentSchema.index({ article: 1, createdAt: -1 });

commentSchema.methods.approuver = function() {
    this.approuve = true;
    return this.save();
};

commentSchema.statics.findApprouvesByArticle = function(articleId) {
    return this.find({ article: articleId, approuve: true })
        .sort({ createdAt: -1 });
};

//Populate automatique
commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'article',
        select: 'title author'
    });
    next();
});

export const Comment = mongoose.model('Comment', commentSchema);