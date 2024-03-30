var express = require('express')
var userModel = require('../schemas/user')
var router = express.Router()

/* GET */
router.get('/', async function (req, res, next) {
    const limit = req.query.limit || 1
    const page = req.query.page || 1

    let sort = {}

    if (req.query.sort) {
        if (req.query.sort.startsWith('-')) {
            sort[req.query.sort.substring(1, req.query.sort.length)] = -1
        } else {
            sort[req.query.sort] = 1
        }
    }

    const contain = Object.fromEntries(
        Object.keys(req.query)
            .filter((v) => !['limit', 'page', 'sort'].includes(v))
            .map((key) => {
                let value = req.query[`${key}`]
                if (typeof req.query[key] === 'string') {
                    value = value?.replace(',', '|') || value
                    value = new RegExp(value, 'i')
                }
                return [key, value]
            })
    )

    console.log(contain)
    const items = await userModel
        .find({
            isDeleted: false,
            ...contain,
        })
        .populate('published')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
        .exec()
    res.send(items.filter((v) => !v.isDeleted))
})

/* GET */
router.get('/:id', async function (req, res, next) {
    try {
        const item = await userModel
            .find({
                _id: decodeURIComponent(req.params.id),
                isDeleted: false,
            })
            .exec()
        res.send(item)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

/* POST */
router.post('/', async function (req, res, next) {
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

/* PUT */
router.put('/:id', async function (req, res, next) {
    try {
        const item = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        )
        res.send(item)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

/* DELETE */
router.delete('/:id', async function (req, res, next) {
    try {
        const item = await userModel.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
            },
            {
                new: true,
            }
        )
        res.send(item)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

module.exports = router
