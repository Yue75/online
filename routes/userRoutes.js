const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');


router.get('/',userController.getAllUsers); 
router.get('/:id', userController.getUserById); 
router.post('/', userController.createUser);
router.post('/:id', userController.updateUser); 
router.get('/delete/:id', userController.deleteUser);


router.post('/login', userController.loginUser); 
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Bienvenue sur votre profil sécurisé.', user: req.user });
}); 

module.exports = router;
