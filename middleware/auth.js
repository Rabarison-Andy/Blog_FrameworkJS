import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import AppError from '../utils/AppError';
import { catchAsync } from '../middleware/errorHandler';

export const protect = catchAsync(async (req, res, next) => {
  // 1) Récupérer le token
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Non authentifié', 401));
  }

  // 2) Vérifier le token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) Vérifier que l'utilisateur existe
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('Utilisateur introuvable', 401));
  }
  
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Mot de passe récemment modifié', 401));
  }

  // 4) Attacher l'utilisateur à la requête
  req.user = currentUser;
  next();
});
