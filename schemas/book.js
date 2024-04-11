const mongoose = require('mongoose')

const bookSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        year: Number,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'author'
        },
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
