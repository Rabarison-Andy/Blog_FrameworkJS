import dotenv from 'dotenv'
import express from "express";
import mongoose, { version } from "mongoose";
import { connectDB } from "./config/database.js";
import articleRoutes from "./models/articles.js";


dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json());

mongoose.connect("mongodb://mongo:27017/testdb")
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.json({
    message: 'Bienvenue',
    version: '1.0.0',
    status: 'le serveur fonctionne à merveille'
  })
});

app.use('/api/Article', articleRoutes)



async function startServer() {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log('Serveur Express sur le port ${PORT}')
        })
    } catch (error) {
        console.log("Erreur au démarrage du serveur : ", error);
        process.exit(1)
    }
}

startServer()


const { errorHandler, notFound } = require('./middleware/errorHandler');