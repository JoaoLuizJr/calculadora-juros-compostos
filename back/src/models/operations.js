const mongoose = require('mongoose');

const operationsSchema = mongoose.Schema({
    initialValue: {type: Number, required: true},
    monthlyValue: {type: Number, required: true},
    fees: {type: Number, required: true},
    temp: {type: Number, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Operations', operationsSchema);