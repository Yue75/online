const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

const categoryRoutes = require('./routes/categoryRoutes'); 
const productRoutes = require('./routes/productRoutes'); 

const app = express();

// Configuration du moteur de vues
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes statiques (fichiers CSS, JS, images, etc.)
app.use(express.static('public'));

// Route principale (menu de navigation)
app.get('/', (req, res) => {
  res.render('home'); // Affiche la page d'accueil
});

// Routes pour les catégories
app.use('/categories', categoryRoutes);

// Routes pour les produits
app.use('/produits', productRoutes);

// Synchronisation de la base de données
sequelize.sync({ force: false }) // Ne réinitialise pas les données à chaque lancement
  .then(() => console.log('Base synchronisée avec succès.'))
  .catch(error => console.error('Erreur de synchronisation :', error));

// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API lancée sur http://localhost:${PORT}`);
});
