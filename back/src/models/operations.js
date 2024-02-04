const mongoose = require('mongoose');

const operationsSchema = mongoose.Schema({
    initial: {type: String, required: true},
    monthly: {type: String, required: true},
    fees: {type: String, required: true},
    temp: {type: String, required: true},
    totalFees: {type: String, required: true},
    totalInvest: {type: String, required: true},
    total: {type: String, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    access: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Access',
        require: true
    }
});

module.exports = mongoose.model('Operations', operationsSchema);