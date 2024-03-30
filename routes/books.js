var express = require('express')
var bookModel = require('../schemas/book')
var router = express.Router()

// var books = [
//     {
//         id: 1,
//         name: 'Sach giao khoa 1',
//     },
//     {
//         id: 2,
//         name: 'Sach giao khoa 2',
//     },
//     {
//         id: 3,
//         name: 'Sach giao khoa 3',
//     },
// ]

function genId(length) {
    const source =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let index = 0; index < length; index++) {
        const rand = source[Math.floor(Math.random() * source.length - 1)]
        result += rand
    }
    return result
}

/* GET books listing. */
router.get('/', async function (req, res, next) {
    const limit = req.query.limit || 10
    const page = req.query.page || 1

    let sort = {}

    if (req.query.sort) {
        if (req.query.sort.startsWith('-')) {
            sort[req.query.sort.substring(1, req.query.sort.length)] = -1
        } else {
            sort[req.query.sort] = 1
        }
    }

    /**
     * ! WARNING: asd
     */
    const contain = Object.fromEntries(
        Object.keys(req.query)
            .filter((v) => !['limit', 'page', 'sort'].includes(v))
            .map((key) => {
                const stringArray = ['name', 'author']
                const numberArray = ['year']
                let value = req.query[`${key}`]
                if (stringArray.includes(key)) {
                    value = value?.replace(',', '|') || value
                    value = new RegExp(value, 'i')
                }
                if (numberArray.includes(key)) {
                    let string = JSON.stringify(value)
                    let newString = string.replaceAll(
                        /^(?!\$)(lte|lt|gt|gte)$/gi,
                        (res) => '$' + res
                    )
                    value = JSON.parse(string)
                    console.log(string, value, newString)
                }
                return [key, value]
            })
    )

    console.log(contain)
    const books = await bookModel
        .find({
            isDeleted: false,
            // ...contain,
        })
        .populate('author')
        .lean()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
        .exec()
    res.send(books.filter((v) => !v.isDeleted))
})

/* GET book by id. */
router.get('/:id', async function (req, res, next) {
    try {
        const book = await bookModel
            .find({
                _id: decodeURIComponent(req.params.id),
                isDeleted: false,
            })
            .exec()
        res.send(book)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

/* POST a book . */
router.post('/', async function (req, res, next) {
    try {
        // if (books.some((v) => v.id == req.body.id)) {
        //     res.status(400).send('ID da ton tai')
        // } else {
        const book = new bookModel({
            name: req.body.name,
            author: req.body.author,
            year: req.body.year,
        })
        await book.save()
        res.send(book)
        // }
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

/* PUT  edit a book . */
router.put('/:id', async function (req, res, next) {
    try {
        const book = await bookModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        )
        res.send(book)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

/* DELETE delete a book . */
router.delete('/:id', async function (req, res, next) {
    try {
        const book = await bookModel.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
            },
            {
                new: true,
            }
        )
        res.send(book)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            message: error.message,
        })
    }
})

module.exports = router
