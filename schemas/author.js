const mongoose = require('mongoose')

const authorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
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

const AuthorModel = new mongoose.model('author', authorSchema)

module.exports = AuthorModel
