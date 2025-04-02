const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('online', 'root', '', {
  host: 'localhost', 
  dialect: 'mariadb', 
  logging: false, 
});


sequelize.authenticate()
  .then(() => console.log('Connexion établie avec MariaDB.'))
  .catch(error => {
    console.error('Erreur de connexion à la base de données :', error);
    process.exit(1); 
  });

module.exports = sequelize;
