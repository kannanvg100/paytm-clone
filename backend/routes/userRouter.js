const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { protect } = require('../middlewares/auth')
const authMiddleware = require('../middlewares/auth')

router.post('/login', userController.login)
router.post('/signup', userController.signup)
router.get('/logout', userController.logoutUser)
router.get('/refresh-token', userController.refreshToken)

module.exports = router
