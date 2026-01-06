import { User } from "../models/User.js";
import AppError from "../utils/AppError.js"
import QueryFeatures from "../utils/queryFeatures.js";
import { catchAsync } from "../middleware/errorHandler.js"
import jwt from 'jsonwebtoken';

export const getMe = (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            user: req.user
        }
    });
};

export const updateMe = catchAsync(async (req, res, next) => {
    const allowedFields = ['nom', 'email'];
    const updates = {}

    Object.keys(req.body).forEach(el => {
        if (allowedFields.includes(el)) updates[el] = req.body[el];
    });

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        {
            new: true,
            runValidators: true
        }
    );

    user.password = undefined;
    
    res.status(200).json({
        success: true,
        data: { user }
    });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!req.body.newPassword || req.body.newPassword.length < 6) {
    return next(new AppError('Nouveau mot de passe invalide', 400));
  }

  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Mot de passe mis à jour'
  });
});