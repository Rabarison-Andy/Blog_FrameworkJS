import dotenv from 'dotenv'
import express from "express";
import helmet from 'helmet';
import mongoose from "mongoose";
import { connectDB } from "./config/database.js";
import articleRoutes from "./routes/articles.js";
import authRoutes from "./routes/auth.js";
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import commentGlobalRoutes from './routes/commentRoutes.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json({ limit: '10kb' }));

// On configure Helmet pour autoriser le chargement des images depuis le frontend
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // frontend
  credentials: true
}));

// Middleware pour parser les données URL-encodées (formulaires)
app.use(express.urlencoded({ extended: true }));

const golbalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Trop de requêtes, réssayer plus tard'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Trop de tentatives de connexion'
});

/*mongoose.connect("mongodb://mongo:27017/testdb")
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error(err)); */

app.get("/", (req, res) => {
  res.json({
    message: 'Bienvenue',
    version: '1.0.0',
    status: 'le serveur fonctionne à merveille'
  })
});

app.use('/api', golbalLimiter);

app.use('/api/auth', authLimiter);

app.use('/api/auth', authRoutes);

app.use('/uploads', express.static('uploads'));

app.use(mongoSanitize());

app.use('/api/articles', articleRoutes);

app.use('/api/comments', commentGlobalRoutes)



async function startServer() {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Serveur Express sur le port ${PORT}`)
        })
    } catch (error) {
        console.log("Erreur au démarrage du serveur : ", error);
        process.exit(1)
    }
}

startServer()

//Middleware 404 (notFound)
app.use(notFound);

//Middleware d'erreurs (errorHandler)
// A LA FIN DE SERVER.JS
app.use((err, req, res, next) => {
  console.error("🔥 ERREUR FATALE DETECTÉE :", err); // Ça va afficher l'erreur en rouge
  console.error(err.stack); // Ça te dira la ligne exacte
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});