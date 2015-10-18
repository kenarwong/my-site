var express = require('express');
var Comment = require('../models/comment.js');
var Content = require('../models/content.js');
var router = express.Router();
var fs = require('fs');

/* Default */
router.get('/', function(req, res) {
	res.send(null);
});

/* GET JSON data. */
router.get('/comment', function(req, res) {
	// fs.readFile('_data.json', function(err, data) {
	// 	res.setHeader('Content-Type', 'application/json');
	// 	res.send(data);
	// });
	Comment.find({}, function(err,docs){
		res.json(docs);
	});
});

/* POST JSON data. */
router.post('/comment', function(req, res) {
	// fs.readFile('_data.json', function(err, data) {
	// 	var contents = JSON.parse(data);
	// 	contents.push(req.body)
	// 	fs.writeFile('_data.json', JSON.stringify(contents, null, 4), function (err) {
	// 		res.setHeader('Content-Type', 'application/json');
	// 		res.setHeader('Cache-Control', 'no-cache');
	// 		res.send(JSON.stringify(contents));
	// 	});
	// });

	var comment = new Comment({
		author: req.body.author,
		text: req.body.text
	});
	comment.save(function (err, data) {
	  if (err) return console.error(err);
	  console.log(data);
	  console.log('saved comment, author: ' + comment.author + ', text: ' + comment.text);
	})
});

//router.get('/content/:navurl?', function(req, res) {
//  var navurl = req.params.navurl || "home";
//	Content.find({navurl:navurl}).sort('order').exec(function(err,results){
//    //console.log(results);
//    res.json(results);
//  });
//});

module.exports = router;
