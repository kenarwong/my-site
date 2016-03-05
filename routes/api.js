var express = require('express');
var NavItem = require('../models/navitem.js');
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


/* GET home page. */
router.get('/content/:nav?', function(req, res, next) {
  var navurl = req.params.nav || 'home';
  //
  // Querybuildier for nav
  var navqry = NavItem.find({'navurl': navurl}).exec();

  // Querybuilder for content
  var contentqry = Content.find({'navurl': navurl}).sort('order').exec();

    // dummy finalize cb fnc
  navqry.addBack(function(){
    console.log('nav query complete');
  });

  // dummy error cb fnc
  navqry.addErrback(function() {
    console.log('uncaught error in nav query');
    //return {httpcode: 500};
  });

  //// dummy finalize cb fnc
  //contentqry.addBack(function(){
  //  console.log('content query complete');
  //});

  //// dummy error cb fnc
  //contentqry.addErrback(function() {
  //  console.log('uncaught error in content query');
  //  //return {httpcode: 500};
  //});

  navqry.then(function(navitems) {
      navdata = {
        title: navitems[0].friendlyname,
        navitems: navitems
      };

      if (Object.getOwnPropertyNames(navdata).length > 0) {
        return {httpcode: 200, navdata: navdata};
      } else {
        console.log('navigation data error');
        return {httpcode: 404};
      }

  }).then(function(navresults) {
    contentqry.then(function(contentresults) {
      if (contentresults.length == 0) {
        console.log('content not found: ' + navresults.navdata.title);

        res.status(404).render('error', {
          message: 'Not found',
          error: {}
        });
      } else {
        res.json({
          title: navresults.navdata.title, 
          data: contentresults
        });
      };
    });
  });
});

module.exports = router;
