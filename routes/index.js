var express = require('express');
var NavItem = require('../models/navitem.js');
var router = express.Router();

/* GET home page. */
router.get('/:nav?', function(req, res, next) {
  var vm = {
    env: req.app.get('env')
  };

  //console.log(vm);

  var navqry = NavItem.find({}).exec();

  navqry.addBack(function(){
    console.log('nav query complete');
  });

  navqry.addErrback(function() {
    console.log('uncaught error');
    //return {httpcode: 500};
  });

  navqry.then(function(navitems) {
    var navdata;

    //console.log(navitems);
    var navurl = req.params.nav || 'home';
    var navfilter = navitems.filter(function(obj) {return obj.navurl == navurl});

    if (navfilter.length == 0) {
      console.log('not found: ' + req.params.nav);
      return {httpcode: 404};
    } else {
      navdata = {
        title: navfilter[0].friendlyname,
        thisurl: navfilter[0].navurl,
        navitems: navitems
      };

      //console.log(navdata);

      if (Object.getOwnPropertyNames(navdata).length > 0) {
        //console.log(Object.getOwnPropertyNames(navdata));
        return {httpcode: 200, navdata: navdata};

      } else {
        console.log('navigation data error');
        return {httpcode: 404};
      }
    }
  }).then(function(data) {
    if (data.httpcode == 200){
      //console.log(vm);
      Object.getOwnPropertyNames(data.navdata).forEach(function(e, i) {
        //console.log(e);
        vm[e] = data.navdata[e];
      });

      //console.log(req.app.get('env'));
      res.render('index', vm
          //{ 
          //  title: friendlyname,
          //  thisurl: navfilter[0].navurl,
          //  navitems: navitems,
          //}
          );
    } else if (data.httpcode == 404) {
      res.status(404).render('error', {
        message: 'Not found',
        error: {}
      });
    } else {
      res.status(500).render('error', {
        message: 'Oops, an error occured.',
        error: {}
      });
    }
  });


});

module.exports = router;
