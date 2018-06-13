$(window).scroll(function() {
    const box = $(".titleBox");
    const h = box.height();
    box.css("opacity", 1 - $(window).scrollTop() / h);
  });

function myFunction() {
    let x = document.getElementById("navBar");
    if (x.className === "navBar") {
        x.className += " responsive";
    } else {
        x.className = "navBar";
    }
}