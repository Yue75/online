const sequelize = require('../config/database');


exports.getAllProduits = async (req, res) => {
    try {
        const produits = await sequelize.query(
            `SELECT p.*, c.nom AS categorieNom FROM produits p 
             LEFT JOIN categories c ON p.categorieId = c.id`, 
            { type: sequelize.QueryTypes.SELECT }
        );
     
        res.render('products/index', { products: produits });
    } catch (error) {
        res.status(500).render('error', { error: 'Erreur serveur lors du chargement des produits.' });
    }
};


exports.getProduitById = async (req, res) => {
    try {
     
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).render('error', { error: 'ID invalide.' });
        }

        
        const produit = await sequelize.query(
            `SELECT p.*, c.nom AS categorieNom FROM produits p 
             LEFT JOIN categories c ON p.categorieId = c.id 
             WHERE p.id = ?`,
            {
                replacements: [id], 
                type: sequelize.QueryTypes.SELECT,
            }
        );

     
        if (produit.length === 0) {
            return res.status(404).render('error', { error: 'Produit non trouvé.' });
        }

     
        res.render('products/details', { product: produit[0] });
    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error);
        res.status(500).render('error', { error: 'Erreur serveur lors du chargement du produit.' });
    }
};


exports.createProduit = async (req, res) => {
    try {
        const { nom, description, prix, stock, codeEAN, categorieId } = req.body;

     
        if (prix < 10 || prix > 500 || stock < 0) {
            return res.status(400).render('error', { error: 'Valeurs invalides pour prix ou stock.' });
        }

        await sequelize.query(
            `INSERT INTO produits (nom, description, prix, stock, codeEAN, categorieId) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            { replacements: [nom, description, prix, stock, codeEAN, categorieId] }
        );
    
        res.redirect('/produits');
    } catch (error) {
        res.status(400).render('error', { error: 'Erreur lors de la création du produit.' });
    }
};


exports.updateProduit = async (req, res) => {
    try {
        const { nom, description, prix, stock, codeEAN, categorieId } = req.body;

        const produit = await sequelize.query(
            `SELECT * FROM produits WHERE id = ?`,
            { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT }
        );

        if (produit.length === 0) return res.status(404).render('error', { error: 'Produit non trouvé.' });

        await sequelize.query(
            `UPDATE produits SET nom = ?, description = ?, prix = ?, stock = ?, codeEAN = ?, categorieId = ? 
             WHERE id = ?`,
            { replacements: [nom, description, prix, stock, codeEAN, categorieId, req.params.id] }
        );
      
        res.redirect('/produits');
    } catch (error) {
        res.status(400).render('error', { error: 'Erreur lors de la mise à jour du produit.' });
    }
};


exports.deleteProduit = async (req, res) => {
    try {
        const produit = await sequelize.query(
            `SELECT * FROM produits WHERE id = ?`,
            { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT }
        );

        if (produit.length === 0) return res.status(404).render('error', { error: 'Produit non trouvé.' });

        await sequelize.query(
            `DELETE FROM produits WHERE id = ?`,
            { replacements: [req.params.id] }
        );
    
        res.redirect('/produits');
    } catch (error) {
        res.status(500).render('error', { error: 'Erreur serveur lors de la suppression du produit.' });
    }
};
