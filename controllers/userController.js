const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await sequelize.query(
            'SELECT * FROM user',
            { type: sequelize.QueryTypes.SELECT }
        );
        res.render('users/index', { users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).render('error', { error: 'Erreur serveur.' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await sequelize.query(
            'SELECT * FROM user WHERE id = ?',
            { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT }
        );
        if (user.length === 0) return res.status(404).render('error', { error: 'Utilisateur non trouvé.' });

        res.render('users/details', { user: user[0] });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        res.status(500).render('error', { error: 'Erreur serveur.' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { prenom, mail, mdp } = req.body;

       
        const hashedPassword = await bcrypt.hash(mdp, 10);

        await sequelize.query(
            'INSERT INTO user (prenom, mail, mdp) VALUES (?, ?, ?)',
            { replacements: [prenom, mail, hashedPassword] }
        );

        res.redirect('/users');
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        res.status(500).render('error', { error: 'Erreur serveur.' });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { prenom, mail, mdp } = req.body;

        const user = await sequelize.query(
            'SELECT * FROM user WHERE id = ?',
            { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT }
        );
        if (user.length === 0) return res.status(404).render('error', { error: 'Utilisateur non trouvé.' });

        const hashedPassword = mdp ? await bcrypt.hash(mdp, 10) : user[0].mdp;

        await sequelize.query(
            'UPDATE user SET prenom = ?, mail = ?, mdp = ? WHERE id = ?',
            { replacements: [prenom, mail, hashedPassword, req.params.id] }
        );

        res.redirect('/users');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        res.status(500).render('error', { error: 'Erreur serveur.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await sequelize.query(
            'SELECT * FROM user WHERE id = ?',
            { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT }
        );
        if (user.length === 0) return res.status(404).render('error', { error: 'Utilisateur non trouvé.' });

        await sequelize.query(
            'DELETE FROM user WHERE id = ?',
            { replacements: [req.params.id] }
        );

        res.redirect('/users');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        res.status(500).render('error', { error: 'Erreur serveur.' });
    }
};



exports.loginUser = async (req, res) => {
    console.log('Méthode loginUser appelée');
    console.log('Requête reçue :', req.body);

    const { mail, mdp } = req.body;

    try {
        const user = await sequelize.query(
            'SELECT * FROM user WHERE mail = ?',
            { replacements: [mail], type: sequelize.QueryTypes.SELECT }
        );
        console.log('Utilisateur trouvé en base :', user);

        if (user.length === 0) {
            console.log('Utilisateur introuvable');
            return res.status(401).render('error', { error: 'Email ou mot de passe invalide.' });
        }

        const isPasswordValid = await bcrypt.compare(mdp, user[0].mdp);
        console.log('Mot de passe valide ?', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Mot de passe incorrect');
            return res.status(401).render('error', { error: 'Email ou mot de passe invalide.' });
        }

        const token = jwt.sign(
            { id: user[0].id, mail: user[0].mail, prenom: user[0].prenom },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '2h' }
        );
        console.log('Token généré :', token);

        return res.status(200).json({
            message: 'Connexion réussie.',
            token,
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return res.status(500).render('error', { error: 'Erreur serveur.' });
    }
};
