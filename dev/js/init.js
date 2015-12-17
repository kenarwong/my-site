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

  // Dev
  $(document).on('click','li.dev li',function(){
      $(this).toggleClass('selected', !$(this).hasClass('selected'));
      document.styleSheets[2].disabled = !$(this).hasClass('selected');
  });
});
