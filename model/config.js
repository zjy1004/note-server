var mongoose = require('mongoose');
// mongoose.connect('mongodb://119.23.15.173', {
mongoose.connect('mongodb://localhost/e-home', {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected succeed')
});

module.exports = db;