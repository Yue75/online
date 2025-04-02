const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Categorie = require('./Category');

const Produit = sequelize.define('Produit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 10,
            max: 500
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    codeEAN: {
        type: DataTypes.STRING,
        unique: true
    },
    categorieId: {
        type: DataTypes.INTEGER,
        references: {
            model: Categorie,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

Categorie.hasMany(Produit, { foreignKey: 'categorieId' });
Produit.belongsTo(Categorie, { foreignKey: 'categorieId' });

module.exports = Produit;