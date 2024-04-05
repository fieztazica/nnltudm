const options = {
    PASSWORD: {
        minLength: 8,
    },
    ROLES: { enums: ['USER', 'ADMIN', 'MOD'] },
    USERNAME: {
        length: {
            min: 8,
            max: 40,
        },
    },
}

const messages = {
    errors: {
        PASSWORD: 'Mat khau qua yeu!',
        EMAIL: 'Email phai dung dinh dang!',
        USERNAME: `Username phai co do dai toi thieu la ${options.USERNAME.length.min} va toi da la ${options.USERNAME.length.max}!`,
        ROLES: `Role phai la 1 trong 3: ${options.ROLES.enums.join(', ')}!`,
    },
}

module.exports = {
    options,
    messages,
}
