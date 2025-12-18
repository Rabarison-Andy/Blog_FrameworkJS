import { catchAsync } from '../middleware/errorHandler';
import { verify } from 'jsonwebtoken';
import AppError from './errorHandler';
import { findById } from '../models/User';

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
    const decoded = await promisify(verify)(token, process.env.JWT_SECRET);

    // 3) Vérifier que l'utilisateur existe
    const currentUser = await findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('Utilisateur introuvable', 401));
    }

// 4) Attacher l'utilisateur à la requête
    req.user = currentUser;
    next();
});
