var express = require('express');
var router = express.Router();
var fs = require('fs');

/* Default */
router.get('/', function(req, res) {
	res.send(null);
});

/* GET JSON data. */
router.get('/data.json', function(req, res) {
	fs.readFile('_data.json', function(err, data) {
		res.setHeader('Content-Type', 'application/json');
		res.send(data);
	});
});

/* POST JSON data. */
router.post('/data.json', function(req, res) {
	fs.readFile('_data.json', function(err, data) {
		var contents = JSON.parse(data);
		contents.push(req.body)
		fs.writeFile('_data.json', JSON.stringify(contents, null, 4), function (err) {
			res.setHeader('Content-Type', 'application/json');
			res.setHeadeR('Cache-Control', 'no-cache');
			res.send(JSON.stringify(contents));
		});
	});
});

module.exports = router
