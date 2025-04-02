const sequelize = require('../config/database');


exports.getAllCategories = async (req, res) => {
    try {
        const categories = await sequelize.query('SELECT * FROM categories', { type: sequelize.QueryTypes.SELECT });
  
        res.render('categories/index', { categories });
    } catch (error) {
        res.status(500).render('error', { error: 'Erreur serveur lors du chargement des catégories.' });
    }
};


exports.getCategorieById = async (req, res) => {
    try {
        const categorie = await sequelize.query('SELECT * FROM categories WHERE id = ?', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT,
        });
        if (categorie.length === 0) return res.status(404).render('error', { error: 'Catégorie non trouvée.' });
  
        res.render('categories/details', { categorie: categorie[0] });
    } catch (error) {
        res.status(500).render('error', { error: 'Erreur serveur lors du chargement de la catégorie.' });
    }
};

exports.createCategorie = async (req, res) => {
    try {
        const { nom, description } = req.body;
        await sequelize.query('INSERT INTO categories (nom, description) VALUES (?, ?)', {
            replacements: [nom, description],
        });
       
        res.redirect('/categories');
    } catch (error) {
        res.status(400).render('error', { error: 'Erreur lors de la création de la catégorie.' });
    }
};

exports.updateCategorie = async (req, res) => {
    try {
        const { nom, description } = req.body;
        const categorie = await sequelize.query('SELECT * FROM categories WHERE id = ?', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT,
        });
        if (categorie.length === 0) return res.status(404).render('error', { error: 'Catégorie non trouvée.' });

        await sequelize.query('UPDATE categories SET nom = ?, description = ? WHERE id = ?', {
            replacements: [nom, description, req.params.id],
        });
       
        res.redirect('/categories');
    } catch (error) {
        res.status(400).render('error', { error: 'Erreur lors de la mise à jour de la catégorie.' });
    }
};

exports.deleteCategorie = async (req, res) => {
    try {
        const categorie = await sequelize.query('SELECT * FROM categories WHERE id = ?', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT,
        });
        if (categorie.length === 0) return res.status(404).render('error', { error: 'Catégorie non trouvée.' });

        const produits = await sequelize.query('SELECT * FROM produits WHERE categorieId = ?', {
            replacements: [req.params.id],
            type: sequelize.QueryTypes.SELECT,
        });
        if (produits.length > 0) {
            return res.status(400).render('error', { error: 'Impossible de supprimer une catégorie contenant des produits.' });
        }

        await sequelize.query('DELETE FROM categories WHERE id = ?', { replacements: [req.params.id] });
      
        res.redirect('/categories');
    } catch (error) {
        res.status(500).render('error', { error: 'Erreur serveur lors de la suppression de la catégorie.' });
    }
};
