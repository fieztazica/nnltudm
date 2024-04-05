const { check } = require('express-validator')
const { messages } = require('./config')

module.exports = function () {
    return check('email', messages.errors.EMAIL).isEmail()
}
