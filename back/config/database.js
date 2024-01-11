const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/calculator')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log(err));