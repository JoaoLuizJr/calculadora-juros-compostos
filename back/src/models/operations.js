const mongoose = require('mongoose');

const operationsSchema = mongoose.Schema({
    totalFees: {type: Number, required: true},
    totalInvest: {type: Number, required: true},
    total: {type: Number, required: true},
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