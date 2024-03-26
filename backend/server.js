require('dotenv').config()

const sequelize = require('./config/sequelize')
sequelize.authenticate().then(() => {
    sequelize.sync();
    console.log('Connection has been established successfully.')
}).catch((error) => {
    console.error('Unable to connect to the database:', error)
})

const app = require('./app')

//Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error:${err}`)
    console.log(`Shutting down the server due to Uncaught Exception `)
    process.exit(1)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
})

//Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error:${err}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)
    server.close(() => {
        process.exit(1)
    })
})