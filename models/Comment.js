const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
    commentairecontenu: {
            type: String,
            required: [true, 'Le contenu est obligatoire'],
            trim: true,
            maxlength: [1000, 'Maximum 500 caractères']
        },

    auteurcommentaire: {
            type: String,
            required: [true, 'Auteur obligatoire'],
            trim: true,
            maxlength: [100, 'Maximum 100 caractères']
        },
    articlearticle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: [true, 'Article obligatoire']
        },
    Modérationapprouve: {
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

commentSchema.index({ article: 1, createdAt: -1 });

commentSchema.methods.approuver = function() {
    this.approuve = true;
    return this.save();
};

commentSchema.statics.findApprouvesByArticle = function(articleId) {
    return this.find({ article: articleId, approuve: true })
        .sort({ createdAt: -1 });
};

commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'article',
        select: 'titre auteur'
    });
    next();
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
