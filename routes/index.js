var express = require('express');
var NavItem = require('../models/navitem.js');
var router = express.Router();

/* GET home page. */
router.get('/:nav?', function(req, res, next) {
  var vm = {
    env: req.app.get('env')
  };

  //console.log(vm);

  var navdata;

  NavItem.find({}, function(err, navitems) {
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
      navdata = {
        title: navfilter[0].friendlyname,
        thisurl: navfilter[0].navurl,
        navitems: navitems
      }

      //console.log(navdata);

      if (Object.getOwnPropertyNames(navdata).length > 0) {
        //console.log(Object.getOwnPropertyNames(navdata));
        Object.getOwnPropertyNames(navdata).forEach(function(e, i) {
          //console.log(e);
          vm[e] = navdata[e];
        });
      } else {
        res.status(500).render('error', {
          message: 'Error: Navigation data.',
          error: {}
        });
      }

      //console.log(vm);

      //console.log(req.app.get('env'));
      res.render('index', vm
          //{ 
          //  title: friendlyname,
          //  thisurl: navfilter[0].navurl,
          //  navitems: navitems,
          //}
          );
    }
  });
});

module.exports = router;
