const jwt = require('jsonwebtoken');

module.exports = {
    generateRefreshToken: (userId, role = 'user') => {

        if (!userId || !role) {
            throw new Error('Missing userId or role');
        }

        if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
            throw new Error('JWT_REFRESH_TOKEN_SECRET environment variable is not defined');
        }

        const token = jwt.sign({ userId, role }, process.env.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: '30d',
        });

        return token;

    },
    generateAccessToken: (userId, role = 'user') => {

        if (!userId || !role) {
            throw new Error('Missing userId or role');
        }

        if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
            throw new Error('JWT_ACCESS_TOKEN_SECRET environment variable is not defined');
        }

        const token = jwt.sign({ userId, role }, process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
        });

        return token;
    }
}
