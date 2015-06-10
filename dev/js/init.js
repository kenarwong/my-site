$(document).on("scroll", function(e) {
    
  if ($(this).scrollTop() > 50) {
    $('nav').addClass("scrolled");
  } else {
    $('nav').removeClass("scrolled");
  }
  
});
