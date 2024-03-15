var express = require('express')
var router = express.Router()

var books = [
    {
        id: 1,
        name: 'Sach giao khoa 1',
    },
    {
        id: 2,
        name: 'Sach giao khoa 2',
    },
    {
        id: 3,
        name: 'Sach giao khoa 3',
    },
]

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
router.get('/', function (req, res, next) {
    res.send(books.filter((v) => !v.isDeleted))
})

/* GET book by id. */
router.get('/:id', function (req, res, next) {
    const book = books.find((v) => v.id == req.params.id && !v.isDeleted)
    if (!book) res.status(404).send('Not found')
    else res.send(book)
})

/* POST a book . */
router.post('/', function (req, res, next) {
    if (req.body) {
        if (books.some((v) => v.id == req.body.id)) {
            res.status(400).send('ID da ton tai')
        } else {
            let book = {
                ...req.body,
                id: req.body.id || genId(16),
            }
            books.push(book)
            res.send(book)
        }
    } else {
        res.status(400).send('Data ko hop le')
    }
})

/* PUT  edit a book . */
router.put('/:id', function (req, res, next) {
    const book = books.find((v) => v.id == req.params.id)
    if (!book) {
        res.status(404).send('Book not found')
        return
    }

    if (req.body.name) {
        book.name = req.body.name
        res.send(book)
    } else {
        res.status(400).send('Data ko hop le')
    }
})

/* DELETE delete a book . */
router.delete('/:id', function (req, res, next) {
    const book = books.find((v) => v.id == req.params.id)
    if (!book) {
        res.status(404).send('Book not found')
        return
    }

    book.isDeleted = true

    res.send(book)
})

module.exports = router
