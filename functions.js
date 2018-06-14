$(window).scroll(function () {
    const box = $(".titleBox");
    const h = box.height();
    box.css("opacity", 1 - $(window).scrollTop() / h);
});

$(document).ready(function(){
    $("#projectBtn").click(function(){
        console.log("here");
        $("#art").fadeOut(600);
        $("#projects").fadeIn(600);
        $("#projectBtn").css({"color": "black", "font-weight": "500"});
        $("#artBtn").css({"color": "gray", "font-weight": "normal"});
    });

    $("#artBtn").click(function(){
        $("#projects").fadeOut(600);
        $("#art").fadeIn(600);
        $("#artBtn").css({"color": "black", "font-weight": "500"});
        $("#projectBtn").css({"color": "gray", "font-weight": "normal"});
    });
});