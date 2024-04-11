module.exports = function ({ res, status = true, data = null, statusCode }) {
    if (status) {
        res.status(statusCode || 200).send({
            success: true,
            data: data,
        })
    } else {
        res.status(statusCode || 400).send({
            success: false,
            data: data,
        })
    }
}
