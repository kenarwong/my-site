$(document).ready(function(e){
  $('#nav-placeholder').css('height',$('nav').height());

  var updatePage = function(href) {

    $('#main-container').css('height',$('#main-container').css('height')); // Retain height
    $('#main-container').addClass('fadeOut').delay(500).queue(function(next){
    var postExec = function() {
      $('#main-container').css('height',''); // Remove height property
      $('#main-container').removeClass('fadeOut'); // Remove height property
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
