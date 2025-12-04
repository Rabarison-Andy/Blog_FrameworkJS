class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // Marquer comme erreur opérationnelle
        //true = erreur prévisible, false = bug
        this.isOperational = true;

        //Enregistre où l'erreur s'est produite
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
