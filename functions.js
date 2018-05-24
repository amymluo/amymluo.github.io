$(window).scroll(function(){
    $(".titleBox").css("opacity", 1 - $(window).scrollTop() / 350);
  });