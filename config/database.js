import mongoose from "mongoose";

export async function connectDB() {
    try{
        //Les options de connexions, ne mettre que celles par défaut pour l'instant
        const options = {}

        const conn = mongoose.connect(process.env.MONGODB_URL, options)

        console.log('MongoDB connecté : ${conn.connection.host}')
        console.log('MongoDB connecté : ${conn.connection.name}')

        return conn;

    } catch {
        console.error('Erreur de connexion à MongoDB : ')
        console.error(error.message);

        process.exit(1);
    }
}

export async function closeDB() {
    try {
        await mongoose.connection.close();
        console.log('Connexion MongoDB fermée')
    } catch(error){
        console.log('Erreur lors de la fermeture de la connexion : ', error)
    }
}

// Evenements de connexion Mongoose

//En cas d'erreur après la connexion initiale
mongoose.connection.on('error', (err) => {
    console.error('Erreur MongoDB', err);
});

//En cas de perte de la connexion
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB déco');
});

//Gestion du Ctrl+C, gestion de l'arrêt de l'appliation depuis le terminal
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

module.exports = { connectDB, closeDB };