import mongoose from "mongoose";

export async function connectDB() {
    try{
        const options = {}

        const conn = mongoose.connect(process.env.MONGODB_URL, options)

        console.log('MongoDB connecté : ${conn.connection.host}')
        console.log('MongoDB connecté : ${conn.connection.name}')

        return conn

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

process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
})