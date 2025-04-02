const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProduits);
router.get('/:id', productController.getProduitById);
router.post('/', productController.createProduit);
router.put('/:id', productController.updateProduit);
router.delete('/:id', productController.deleteProduit);

module.exports = router;

