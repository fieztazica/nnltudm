var express = require('express')
var authorModel = require('../schemas/author')
var router = express.Router()

/* GET authors listing. */
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
    const authors = await authorModel
        .find({
            isDeleted: false,
            ...contain,
        })
        .populate('published')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
        .exec()
    res.send(authors.filter((v) => !v.isDeleted))
})

/* GET author by id. */
router.get('/:id', async function (req, res, next) {
    try {
        const author = await authorModel
            .find({
                _id: decodeURIComponent(req.params.id),
                isDeleted: false,
            })
            .exec()
        res.send(author)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

/* POST a author . */
router.post('/', async function (req, res, next) {
    try {
        const author = new authorModel(req.body)
        await author.save()
        res.send(author)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

/* PUT  edit a author . */
router.put('/:id', async function (req, res, next) {
    try {
        const author = await authorModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        )
        res.send(author)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

/* DELETE delete a author . */
router.delete('/:id', async function (req, res, next) {
    try {
        const author = await authorModel.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
            },
            {
                new: true,
            }
        )
        res.send(author)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

module.exports = router
