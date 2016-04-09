$(document).ready(function(e){
  $('#nav-placeholder').css('height',$('nav').height()); // Set nav height

  var updatePage = function(href) {

    $('#main-container').css('height',$('#main-container').css('height')); // Retain height

    // Start css fadeOut animation
    // Delay 500 ms
    // Apply final transition state: fadedOut
    $('#main-container').addClass('fadeOut').delay(500).addClass('fadedOut').queue(function(next){

      // Post exec for after component is mounted
      var postExec = function() {
        $('#main-container').css('height',''); // Remove height property
        $('#main-container').removeClass('fadeOut'); // Remove fadeOut class
        $('#main-container').removeClass('fadedOut'); // Remove fadedOut class
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
)();
