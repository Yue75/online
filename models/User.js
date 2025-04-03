const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    mdp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = User;
