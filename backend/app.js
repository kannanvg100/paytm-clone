const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')

const usersRouter = require('./routes/userRouter')
const walletTransactionRouter = require('./routes/walletTransactionRouter')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', usersRouter)
app.use('/api', walletTransactionRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({ message: 'Page not found' })
})

// Middleware For Error Handling
app.use(errorHandler)

module.exports = app
