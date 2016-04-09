$(document).ready(function(e){
  $('#nav-placeholder').css('height',$('nav').height());

  var updatePage = function(href) {
    $('#main-container').css('height',$('#main-container').css('height')); // Retain height

    var fadeOut = function(element,preDelay,delayTime) {
      if(element) {
        setTimeout(function() {
          $(element).addClass('fadeOut' + delayTime).delay(delayTime).addClass('fadedOut');
        }, preDelay);
      }
    };

    var header = $('#main-container h1.content-header');
    var sections = $('#main-container div.content-wrapper > div.content-section');

    var totalDelay = 500;
    fadeOut(header,0,totalDelay);

    var sectionIndices = (function() {
      var arr = [];
      for (var i = 0; i < sections.length; i++) {
        arr.push(i);
      }
      return arr;
    })();

    var sectionIndicesShuffled = [];
    while (sectionIndices.length > 0) {
      var j = Math.floor(Math.random() * sectionIndices.length);
      console.log(sectionIndices[j]);
      sectionIndicesShuffled.push(sectionIndices[j]);
      sectionIndices.splice(sectionIndices.indexOf(sectionIndices[j]),1);
      //console.log(sectionIndices);
      //console.log(sectionIndicesShuffled);
    }

    var maxSectionDelay = 400;
    for (var i = 0; i < sections.length; i++) {
      fadeOut(sections[sectionIndicesShuffled[i]],maxSectionDelay,totalDelay - maxSectionDelay);
      maxSectionDelay -= 100;
    }
    //fadeOut(sections[0],200,totalDelay - 200);
    //fadeOut(sections[1],300,totalDelay - 300);
    //fadeOut(sections[2],400,totalDelay - 400);

    $('#main-container').delay(totalDelay).queue(function(next){
      var postExec = function() {
        $('#main-container').css('height',''); // Remove height property
        $('#main-container .fadeOut').removeClass('fadeOut'); // Remove fadeOut class
        $('#main-container .fadedOut').removeClass('fadedOut'); // Remove fadedOut class
      }

      // Unmount old component, render new component
      React.unmountComponentAtNode(document.getElementById('main-container'));
      React.render(
          React.createElement(ContentBox, {url: "api/content/" + href, data:[], postExec:postExec}),
          document.getElementById('main-container')
          );
      next();
    });

    // Handle css
    var selected = $('li.content-link.selected');
    selected.removeClass('selected');
    selected[0].offsetWidth = selected[0].offsetWidth; // trigger reflow
    $('li.content-link > a[href="' + href + '"]').parent().addClass('selected');
  };

  $(document).on('click','.content-link > a', function(e) {
    // Prevent link click
    // TODO: fallback if libs fail
    e.preventDefault();
    
    // Change content
    updatePage($(this).attr('href'));

    // Handle history
    window.history.pushState({href:$(this).attr('href')},$(this).attr('href'),$(this).attr('href'))
  });
  
  window.onpopstate = function(event) {
    //console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    updatePage(event.state ? event.state.href : "home"); // default home if no state data
  };
});

(function() {
})();
