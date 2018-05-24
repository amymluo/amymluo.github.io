$(window).scroll(function() {
    var h = $(".titleBox").height();
    $(".titleBox").css("opacity", 1 - $(window).scrollTop() / h);
  });