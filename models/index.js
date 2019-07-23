const mongoose = require('mongoose');
const Food = require('./Food');
const User = require('./User');

mongoose.connect(`${process.env.MONGODB_URL}`, {
    useNewUrlParser: true,
    useCreateIndex: true
});

module.exports = {
    User,
    Food
}