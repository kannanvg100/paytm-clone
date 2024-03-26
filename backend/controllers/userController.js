const User = require('../models/User')
const { generateRefreshToken, generateAccessToken } = require('../utils/generateToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body

            const errors = {}
            if (!email) errors.email = 'Email is required'
            if (!password) errors.password = 'Password is required'
            if (Object.keys(errors).length > 0) return res.status(400).json({ errors })

            const user = await User.findOne({ where: { email } })
            if (!user)
                return res.status(404).json({
                    errors: { email: 'You are not registered with us. Pls create an account.' },
                })

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid)
                return res.status(401).json({
                    errors: { password: 'The password you entered is incorrect. Please try again' },
                })

            const refreshToken = generateRefreshToken(user.id)
            const accessToken = generateAccessToken(user.id)

            res.cookie(`refresh_token`, refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            res.status(200).json({
                id: user.id,
                email: user.email,
                accessToken,
            })
        } catch (error) {
            next(error)
        }
    },

    signup: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const errors = {}
            if (!email) errors.email = 'Email is required'
            if (!password) errors.password = 'Password is required'
            if (Object.keys(errors).length > 0) return res.status(400).json({ errors })

            let user = await User.findOne({ where: { email } })
            if (user)
                return res.status(400).json({ errors: { email: 'Email already exists' } })

            const passwordHash = await bcrypt.hash(password, 10)
            user = await User.create({ email, password: passwordHash })

            res.status(201).json({ message: 'User created successfully' })

        } catch (error) {
            next(error)
        }
    },

    logoutUser: (req, res, next) => {
        try {
            res.cookie('refresh_token', '', {
                httpOnly: true,
                expires: new Date(0),
            })
            res.status(200).json({ message: 'Logged out successfully' })
        } catch (error) {
            next(error)
        }
    },

    refreshToken: async (req, res, next) => {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Missing refresh token' });
        }
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
            const user = await User.findByPk(decoded.userId)
            // Generate new access token
            if (!user) return res.status(400).json({ message: 'invalid user' })
            const accessToken = generateAccessToken(decoded.userId)
            res.status(200).json({
                id: user.id,
                email: user.email,
                accessToken: accessToken,
            })
        } catch (error) {
            next(error)
        }
    }
}
