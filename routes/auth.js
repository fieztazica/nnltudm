const express = require('express')
const { compare } = require('bcrypt')
const { SECRET_KEY } = require('../config.json')
const { check, body, validationResult } = require('express-validator')
const userModel = require('../schemas/user')
const jwt = require('jsonwebtoken')
const userValidator = require('../validators/user')
const router = express.Router()

router.post('/register', userValidator(), async function (req, res, next) {
    const result = validationResult(req)
    if (result.errors.length > 0) {
        res.status(400).send({
            success: false,
            data: result.errors,
        })
        return
    }
    try {
        const item = new userModel(req.body)
        await item.save()
        res.send(item)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

router.post('/login', async function (req, res, next) {
    try {
        const username = req.body.username
        const password = req.body.password
        if (!username || !password) {
            res.status(400).send({
                success: false,
                message: 'Missing username or password',
            })
            return
        }
        const item = await userModel.findOne({ username })
        if (!item) {
            res.status(404).send({
                success: false,
                message: 'Username or password incorrect',
            })
            return
        }

        const result = await compare(password, item.password)
        if (!result) {
            res.status(404).send({
                success: false,
                message: 'Username or password incorrect',
            })
            return
        }

        const token = jwt.sign(
            {
                id: item._id,
            },
            SECRET_KEY,
            {
                expiresIn: '1d',
            }
        )

        res.send({
            success: true,
            data: {
                token,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

module.exports = router
