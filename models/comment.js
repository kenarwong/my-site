var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	console.log('db connected');
});

// Connect to our mongo database
mongoose.connect('mongodb://localhost/mydb');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    author     : String
  , text       : String
});

var Comment = mongoose.model('Comment', schema);

// make this available to our users in our Node applications
module.exports = Comment;
