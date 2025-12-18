import { User } from "../models/User";
import AppError from "../utils/AppError";
import { QueryFeatures } from "../utils/queryFeatures";
import { catchAsync } from "../middleware/errorHandler"

const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    user.password = undefined; // 🔐 sécurité

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user
        }
    });
};

exports.register = catchAsync(async (req, res, next) => {
  const { nom, email, password } = req.body;

  if (!nom || !email || !password) {
    return next(new AppError('nom, email et password sont requis', 400));
  }

  const newUser = await User.create({ nom, email, password });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email et mot de passe requis', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Email ou mot de passe incorrect', 401));
    }

    createSendToken(user, 200, res);
});

exports.getMe = (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            user: req.user
        }
    });
};

exports.updateMe = catchAsync(async (req, res, next) => {
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

    res.stauts(200).json({
        success: true,
        data: { user }
    });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new AppError('Mot de passe actuel incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Mot de passe mis à jour'
  });
});