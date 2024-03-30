const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config.json')
const userModel = require('../schemas/user')

/**
 *
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 * @param {import("express").NextFunction} next Next callback
 */
module.exports = async function (req, res, next) {
    function throwError() {
        res.status(401).send({
            success: false,
            message: 'Vui long dang nhap!',
        })
    }
    
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer')
    ) {
        return throwError()
    }

    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return throwError()
    }

    const info = jwt.verify(token, SECRET_KEY)
    if (!info) {
        return throwError()
    }

    const item = await userModel.findById(info.id)
    if (!item) {
        return throwError()
    }

    req.user = item

    next()
}
