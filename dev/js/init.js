//$(document).on("scroll", function(e) {
//  if($('#main-container .main h1').length > 0){
//    var yPos = $('#main-container .main h1').position()['top'];
//    if ($(this).scrollTop() > yPos) {
//      $('nav').addClass("scrolled");
//      $('nav').css('top',$(document).scrollTop() + 'px');
//    } else {
//      $('nav').removeClass("scrolled");
//      $('nav').css('top','0');
//    }
//  }
//});

$(document).ready(function(e){
  $('#nav-placeholder').css('height',$('nav').height());

  var updatePage = function(href) {
    // Unmount old component, render new component
    React.unmountComponentAtNode(document.getElementById('main-container'));
    React.render(
        React.createElement(ContentBox, {url: "api/content/" + href, data:[]}),
        document.getElementById('main-container')
        );

    // Handle css
    $('li.content-link.selected').removeClass('selected');
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
