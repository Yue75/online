const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token manquant ou invalide.' });

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide.' });

        req.user = user; 
        next();
    });
};

module.exports = authenticateToken;
