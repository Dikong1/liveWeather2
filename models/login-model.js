const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

const users = mongoose.model('users', loginSchema);

module.exports = users;