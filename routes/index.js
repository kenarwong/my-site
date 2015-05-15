var express = require('express');
var NavItem = require('../models/navitem.js');
var router = express.Router();

/* GET home page. */
router.get('/:nav?', function(req, res, next) {
  NavItem.find({}, function(err, navitems){
    //console.log(navitems);
    var navurl = req.params.nav || 'home';
    var navfilter = navitems.filter(function(obj) {return obj.navurl == navurl});
    if (navfilter.length == 0) {
      res.status(404).render('error', {
        message: 'Not found',
        error: {}
      });
      return console.log('not found: ' + req.params.nav);
    } else {
      var friendlyname = navfilter[0].friendlyname;
      //console.log(req.app.get('env'));
      res.render('index', { 
        env: req.app.get('env'),
        title: friendlyname,
        navitems: navitems
      });
    }
  });
});

module.exports = router;
