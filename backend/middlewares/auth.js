const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Missing Authorization header' });
        }

        // Extract the token from the header
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid Authorization header format' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError')
            return res.status(401).json({ error: 'token_expired' });
        next(error)
    }
};

module.exports = { protect };

