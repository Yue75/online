const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

const categoryRoutes = require('./routes/categoryRoutes'); 
const productRoutes = require('./routes/productRoutes'); 
const userRoutes = require('./routes/userRoutes'); 

const app = express();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('home'); 
});

app.use('/categories', categoryRoutes);

app.use('/produits', productRoutes);

app.use('/users', userRoutes); 


sequelize.sync({ force: false }) 
  .then(() => console.log('Base synchronisée avec succès.'))
  .catch(error => console.error('Erreur de synchronisation :', error));

  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Requête reçue : ${req.method} ${req.url}`);
    next();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API lancée sur http://localhost:${PORT}`);
});
