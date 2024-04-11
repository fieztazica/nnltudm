const jwt = require('jsonwebtoken')
const { SECRET_KEY, COOKIE_TOKEN_KEY } = require('../config.json')
const userModel = require('../schemas/user')

module.exports = (...requiredRoles) =>
    /**
     *
     * @param {import("express").Request} req Request
     * @param {import("express").Response} res Response
     * @param {import("express").NextFunction} next Next callback
     */
    async function (req, res, next) {
        const userRoles = req.user.role

        const result = userRoles.some((a) =>
            requiredRoles.some((b) => b.toLowerCase() == a.toLowerCase())
        )

        if (!result) {
            res.status(403).send({
                success: false,
                message: 'Ban khong co quyen!',
            })
            return
        }

        next()
    }
