$(window).scroll(function() {
    var h = $(".titleBox").height();
    $(".titleBox").css("opacity", 1 - $(window).scrollTop() / h);
  });

function myFunction() {
    let x = document.getElementById("navBar");
    if (x.className === "navBar") {
        x.className += " responsive";
    } else {
        x.className = "navBar";
    }
}