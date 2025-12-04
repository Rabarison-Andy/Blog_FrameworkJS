const AppError = require('../utils/AppError');

// Handler pour erreurs de validation Mongoose
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Données invalides : ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Handler pour erreurs de cast (ID invalide)
const handleCastError = (err) => {
    const message = `${err.path} invalide : ${err.value}`;
    return new AppError(message, 400);
};

// Handler pour duplication (clé unique)
const handleDuplicateFieldsError = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `La valeur ${value} existe déjà.`;
    return new AppError(message, 400);
};

// Envoyer erreur en développement (détails complets)
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Envoyer erreur en production (masquer détails)
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Erreur connue : montrer au client
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    } else {
        // Erreur inconnue : masquer les détails
        console.error('❌ ERREUR:', err);

        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Une erreur est survenue.'
        });
    }
};

// MIDDLEWARE PRINCIPAL
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;

        // Transformer erreurs Mongoose
        if (error.name === 'CastError') {
            error = handleCastError(error);
        }
        if (error.code === 11000) {
            error = handleDuplicateFieldsError(error);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationError(error);
        }

        sendErrorProd(error, res);
    }
};

// Middleware 404
const notFound = (req, res, next) => {
    const message = `Route non trouvée : ${req.method} ${req.originalUrl}`;
    next(new AppError(message, 404));
};

// Wrapper catchAsync
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = { errorHandler, notFound, catchAsync };