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
  var cookies = Cookie(); // cookies util
  $('#nav-placeholder').css('height',$('nav').height());

  // Dev
  // function to set wire css and set in cookies
  var setWire = function(obj,val) {
    $(obj).toggleClass('selected', val); // toggle on/off
    $.grep(document.styleSheets, function(a) { 
      return (/wire.css$/i).test(a.href) 
    })[0].disabled = !val; // disable style sheet
    cookies.set('wire',val ? 1 : 0,1); // set setting in cookies
  }

  // Use cookies to set wire selection
  setWire($('li.dev li'), cookies.get('wire') === "1");

  // Wire css set function
  $(document).on('click','li.dev li',function(){
    setWire(this,!($(this).hasClass('selected')));
  });

});
