import multer from 'multer';
import AppError from "../utils/AppError.js"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/articles');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `article-${req.user._id}-${Date.now()}.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Seules les images sont autorisées', 400), false);
  }
};

export const uploadArticleImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
}).single('image');
