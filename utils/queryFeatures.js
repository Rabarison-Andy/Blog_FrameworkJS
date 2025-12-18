class QueryFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * FILTRAGE
     * Permet de filtrer par n'importe quel champ
     * Opérateurs avancés supportés :
     * - gte (greater than or equal) : ?vues[gte]=100
     * - gt (greater than) : ?vues[gt]=50
     * - lte (less than or equal) : ?vues[lte]=1000
     * - lt (less than) : ?vues[lt]=500
     */
    filter() {
        // Copie de l'objet queryString
        const queryObj = { ...this.queryString };

        // Champs exclus du filtrage (utilisés pour d'autres fonctionnalités)
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Conversion des opérateurs pour MongoDB, manipulation plus simple sur un strin par rapport à un objet
        // Transforme { vues: { gte: 100 } } en { vues: { $gte: 100 } }
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Application du filtre à la query
        this.query = this.query.find(JSON.parse(queryStr));

        return this; // Retourne this pour permettre le chaînage
    }

    /**
     * RECHERCHE TEXTUELLE
     * Recherche dans les champs titre, contenu et auteur
     * Utilise une regex insensible à la casse pour rechercher
     * dans plusieurs champs simultanément
     */
    search() {
        if (this.queryString.search) {
            // Créer une expression régulière insensible à la casse
            const searchRegex = new RegExp(this.queryString.search, 'i');

            this.query = this.query.find({
                $or: [
                    { titre: searchRegex },
                    { contenu: searchRegex },
                    { auteur: searchRegex }
                ]
            });
        }
        return this;
    }

    /**
     * TRI
     * Trie les résultats selon un ou plusieurs champs
     * 
     * Exemple : ?sort=createdAt (ordre croissant)
     * Exemple : ?sort=-createdAt (ordre décroissant)
     * Exemple : ?sort=-vues,createdAt (multi-critères)
     * 
     * Par défaut : tri par date de création (plus récent en premier)
     */
    sort() {
        if (this.queryString.sort) {
            // Remplacer les virgules par des espaces pour Mongoose
            // "vues,createdAt" devient "vues createdAt"
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // Tri par défaut : plus récent en premier
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    /**
     * PROJECTION (sélection de champs)
     * Limite les champs retournés dans la réponse
     * 
     * Exemple : ?fields=titre,auteur,createdAt
     * Exemple : ?fields=-contenu (exclure le contenu)
     * 
     * Utile pour optimiser les performances en ne récupérant
     * que les données nécessaires
     */
    limitFields() {
        if (this.queryString.fields) {
            // Remplacer les virgules par des espaces
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            // Exclure __v par défaut (version key de Mongoose)
            this.query = this.query.select('-__v');
        }

        return this;
    }

    /**
     * PAGINATION
     * Divise les résultats en pages
     * 
     * Exemple : ?page=2&limit=10
     * 
     * Paramètres :
     * - page : Numéro de la page (défaut: 1)
     * - limit : Nombre d'éléments par page (défaut: 10, max: 100)
     * 
     * Calcul du skip :
     * Page 1, limit 10 : skip 0 (éléments 1-10)
     * Page 2, limit 10 : skip 10 (éléments 11-20)
     * Page 3, limit 10 : skip 20 (éléments 21-30)
     */
    paginate() {
        // Récupération et validation des paramètres
        const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
        const limit = Math.min(
            100,  // Maximum 100 éléments par page
            Math.max(1, parseInt(this.queryString.limit, 10) || 10)
        );

        // Calcul du nombre d'éléments à sauter
        const skip = (page - 1) * limit;

        // Application de la pagination
        this.query = this.query.skip(skip).limit(limit);

        // Stocker les infos de pagination pour la réponse
        this.paginationInfo = {
            page,
            limit,
            skip
        };

        return this;
    }

    /**
     * Méthode helper pour obtenir les informations de pagination
     * à inclure dans la réponse
     */
    getPaginationInfo(totalCount) {
        if (!this.paginationInfo) {
            return null;
        }

        const { page, limit } = this.paginationInfo;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            currentPage: page,
            totalPages,
            pageSize: limit,
            totalItems: totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    }
}

export default QueryFeatures;
