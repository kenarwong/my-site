var express = require('express');
//var React = require('react/addons');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var NavItem = require('../models/navitem.js');
var Content = require('../models/content.js');
var router = express.Router();

/* GET home page. */
router.get('/:nav?', function(req, res, next) {
  var vm = {
    env: req.app.get('env')
  };

  // Querybuilder for nav and content
  var navqry = NavItem.find({}).exec();
  var contentqry = Content.find({});

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
        header: navfilter[0].friendlyname,
        thisurl: navfilter[0].navurl,
        navitems: navitems
      };

      if (Object.getOwnPropertyNames(navdata).length > 0) {
        contentqry.find({'navurl': navurl}).sort('order').exec();
        return {httpcode: 200, navdata: navdata};

      } else {
        console.log('navigation data error');
        return {httpcode: 404};
      }
    }
  }).then(function(navresults) { // nav promise rendering fnc
    if (navresults.httpcode == 200){
      Object.getOwnPropertyNames(navresults.navdata).forEach(function(e, i) {
        vm[e] = navresults.navdata[e];
      });

      // content promise rendering fnc
      contentqry.then(function(contentresults) {
        var ReactPartial = React.createFactory(require('../dev/js/partials/contentSection.js').ReactPartial);
        var reactHtml = ReactDOMServer.renderToString(
            ReactPartial({
              header: navresults.navdata.header,
              data: contentresults
            })
            );

        vm.title = siteTitle + ' | ' + navresults.navdata.header;
        vm.description = siteDescription;
        vm.maincontent = reactHtml;
        vm.twitter = twitterLink;
        vm.stackoverflow = stackoverflowLink;
        vm.github = githubLink;

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
