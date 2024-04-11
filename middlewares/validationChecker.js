const { validationResult } = require("express-validator")

/**
 *
 * @param {import("express-validator").ValidationChain | import("express-validator").ValidationChain[]} validationResults validation chain results
 */
module.exports = (...validationResults) =>
    /**
     *
     * @param {import("express").Request} req Request
     * @param {import("express").Response} res Response
     * @param {import("express").NextFunction} next Next callback
     */
    [
        ...validationResults,
        async function (req, res, next) {
            const result = validationResult(req)
            if (result.errors.length > 0) {
                res.status(400).send({
                    success: false,
                    data: result.errors,
                })
                return
            }
            next()
        },
    ]
