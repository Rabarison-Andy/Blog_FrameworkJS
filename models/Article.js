import mongoose from "mongoose";

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

articleSchema.methods.publier = function() {
    this.publish = true;
    return this.save();
}

articleSchema.methods.unplublish = function() {
    this.publish = false;
    return this.save();
}

articleSchema.methods.incrementViews = function() {
    this.vues += 1;
    return this.save();
}

articleSchema.statics.findPublies = function() {
    return this.find({publie: true}).sort({ createdAt : -1 });
}

articleSchema.virtual('resume').get(function() {
    if (this.content.length <= 150) {
        return this.content;
    }
    return this.contenu.substring(0, 150) + '...'
})

articleSchema.pre('save', function(next) {
    console.log("Sauvegarde de l'article : " + this.titre)
    next()
})

articleSchema.post('save', function(doc) {
    console.log(`Article sauvegardé: ${doc._id}`)
})



export const Article = mongoose.model('Article', articleSchema)