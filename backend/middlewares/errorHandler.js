const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500

    console.error(err)

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    })
}

module.exports = errorHandler
