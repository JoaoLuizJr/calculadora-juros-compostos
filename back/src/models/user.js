const mongoose = require('mongoose');
const operations = require('./operations');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    cell: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    operations:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operation'
    }]
});

module.exports = mongoose.model('User', userSchema);