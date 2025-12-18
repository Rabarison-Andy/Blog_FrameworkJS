import mongoose from "mongoose";
import { Comment } from "./Comment";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: 150
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxLength: 5000
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    categorie: {
      type: String,
      enum: ['Cat1', 'Cat2', 'Cat3', 'Cat4', 'Cat5'],
      required: true
    },
    isPublished: { type: Boolean, default: false },
    tags: {
      type: String,
      enum: ['mongodb', 'mongoose', 'nodejs'],
      required: false,
      trim: true
    },
    views: { type: Number, default: 0 }
  },
  {
    // Options générales sur le schéma
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
    toJSON: {
      virtuals: true
    }
  }
) 

//Méthodes d'instance
articleSchema.methods.publier = function() {
    this.isPublished = true;
    return this.save();
}

articleSchema.methods.unplublish = function() {
    this.isPublished = false;
    return this.save();
}

articleSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
}

//Méthodes statiques
articleSchema.statics.findPublies = function() {
    return this.find({ isPublished: true}).sort({ createdAt : -1 });
}

articleSchema.statics.findByCategorie = function(categorie) {
    return this.find({ categorie, isPublished: true }).sort({ createdAt: -1 });
};

//Champs virtuels
articleSchema.virtual('resume').get(function() {
    if (this.content.length <= 150) {
        return this.content;
    }
    return this.content.substring(0, 150) + '...'
})

/*
articleSchema.virtual('dureeIecture').get(function() {
    const mots = this.contenu.split(' ').length;
    const minutes = Math.ceil(mots / 200);
    return minutes;
}); */

//Middleware avant opération
articleSchema.pre('save', function(next) {
    console.log("Sauvegarde de l'article : " + this.titre)
    next()
})

articleSchema.pre('findOneAndDelete', async function(next) {
  const article = await this.model.findOne(this.getFilter());
  await Comment.deleteMany({ article: article._id });
  next();
});


//Middleware après opération
articleSchema.post('save', function(doc) {
    console.log(`Article sauvegardé: ${doc._id}`)
})



export const Article = mongoose.model('Article', articleSchema)