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

authorSchema.virtual('published', {
    ref: 'book',
    foreignField: 'author',
    localField: '_id',
})

authorSchema.set('toObject', { virtuals: true })
authorSchema.set('toJSON', { virtuals: true })

const AuthorModel = new mongoose.model('author', authorSchema)

module.exports = AuthorModel
