var express = require('express');
var React = require('react/addons');

var NavItem = require('../models/navitem.js');
var Content = require('../models/content.js');
var router = express.Router();

/* GET home page. */
router.get('/:nav?', function(req, res, next) {
  var vm = {
    env: req.app.get('env')
  };

  //console.log(vm);

  // Querybuilder for nav and content
  var navqry = NavItem.find({}).exec();
  var contentqry = Content.find({});

  // dummy finalize cb fnc
  navqry.addBack(function(){
    console.log('nav query complete');
  });

  //// dummy finalize cb fnc
  //contentqry.addBack(function(){
  //  console.log('content query complete');
  //});

  // dummy error cb fnc
  navqry.addErrback(function() {
    console.log('uncaught error in nav query');
    //return {httpcode: 500};
  });

  //// dummy error cb fnc
  //contentqry.addErrback(function() {
  //  console.log('uncaught error in content query');
  //  //return {httpcode: 500};
  //});

  // nav promise formatting fnc
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

        //console.log('break1');
        contentqry.find({'navurl': navurl}).sort('order').exec();
        //console.log('break2');
        return {httpcode: 200, navdata: navdata};

      } else {
        console.log('navigation data error');
        return {httpcode: 404};
      }
    }
  }).then(function(navresults) { // nav promise rendering fnc
    if (navresults.httpcode == 200){
      //console.log(vm);
      Object.getOwnPropertyNames(navresults.navdata).forEach(function(e, i) {
        //console.log(e);
        vm[e] = navresults.navdata[e];
      });

      // content promise rendering fnc
      contentqry.then(function(contentresults) {
        //console.log(req.app.get('env'));
        //var contentdata = {};
        //console.log(contentresults);
        //contentresults.map(function(obj){
        //  contentdata[obj.id] = obj.text;
        //});

          //center-content: contentresults.filter(function(obj){return obj.id == 'center-content'}),
          //left-content: contentresults.filter(function(obj){return obj.id == 'left-content'}),
          //right-content: contentresults.filter(function(obj){return obj.id == 'right-content'})

        //console.log(contentdata);

        //Object.getOwnPropertyNames(contentdata).forEach(function(e, i) {
        //  //console.log(e);
        //  vm[e] = contentdata[e];
        //});

        var ReactPartial = React.createFactory(require('../dev/js/partials/contentSection.js').ReactPartial);
        var reactHtml = React.renderToString(ReactPartial({data:contentresults}));
        //  id: 'test',
        //  text: 'test content testsadfasdfasdf'
        //}));
        //console.log(reactHtml);
        //contentdata['react-partial'] = reactHtml;

        //vm.contentdata = contentdata;
        //console.log(vm);

        vm.maincontent = reactHtml;

        res.render('index', vm
            //{ 
            //  title: friendlyname,
            //  thisurl: navfilter[0].navurl,
            //  navitems: navitems,
            //}
            );
      });

    } else if (navresults.httpcode == 404) {
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
