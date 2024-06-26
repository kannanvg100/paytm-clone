const { Sequelize } = require('sequelize');

// Initialize Sequelize
// const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/postgres')
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialectModule: require('pg')
})

module.exports = sequelize;
