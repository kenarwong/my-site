var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/users.js');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', function (req, res) {
    User.find({}, function (err, docs) {
        res.json(docs);
    });
});

router.get('/:author', function (req, res) {
    if (req.params.author) {
        User.find({ author: req.params.author }, function (err, docs) {
            res.json(docs);
        });
    }
});

module.exports = router;
