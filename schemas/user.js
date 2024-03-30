const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
        },
        role: {
            type: [String],
            required: true,
            default: ['USER'],
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

userSchema.pre('save', function (params) {
    this.password = bcrypt.hashSync(this.password, 10)
})

const UserModel = new mongoose.model('user', userSchema)

module.exports = UserModel
