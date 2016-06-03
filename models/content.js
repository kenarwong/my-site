var mongoose = require('mongoose');

//var db = mongoose.connection;
//
//db.on('error', console.error);
//db.once('open', function() {
//	console.log('db connected');
//});
//
//// Connect to our mongo database
//mongoose.connect('mongodb://localhost/mydb');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    id          : String
  , navurl      : String
  , text        : String
  , order       : String
  , contentType : String
}, { collection: "content" });

var Content = mongoose.model('Content', schema);

// make this available to our users in our Node applications
module.exports = Content;
