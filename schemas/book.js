const mongoose = require('mongoose')

const bookSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            unique: true,
        },
        year: Number,
        author: String,
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const BookModel = new mongoose.model('book', bookSchema)

module.exports = BookModel
