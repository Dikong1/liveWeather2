const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    base: {
        type: String,
        default: "USD"
    },
    rate: {
        type: String,
        required: true
    },
});

const currencies = mongoose.model('currency', currencySchema);

module.exports = currencies;