$(window).scroll(function () {
    const box = $(".titleBox");
    const h = box.height();
    box.css("opacity", 1 - $(window).scrollTop() / h);
});

$(document).ready(function(){
    $("#projectBtn").click(function(){
        console.log("here");
        $("#art").fadeOut(600);
        $("#projects").fadeIn(1500);
        $("#projectBtn").css({"color": "black", "font-weight": "500"});
        $("#artBtn").css({"color": "gray", "font-weight": "normal"});
    });

    $("#artBtn").click(function(){
        $("#projects").fadeOut(600);
        //$("#projects").hide();
        $("#art").fadeIn(1500);
        $("#artBtn").css({"color": "black", "font-weight": "500"});
        $("#projectBtn").css({"color": "gray", "font-weight": "normal"});
    });


    // Get the modal
    const modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
    const artThumbnails = document.getElementsByClassName("art");
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("caption");


    for (let i = 0, len = artThumbnails.length; i < len; i++) {
        const artThumb = artThumbnails[i];

        artThumb.onclick = function() {
            modal.style.display = "block";
            style = artThumb.currentStyle || window.getComputedStyle(artThumb, false);

            modalImg.src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            captionText.innerHTML = artThumb.childNodes[5].innerHTML;
        }
    }


// Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    modal.onclick = function() {
        modal.style.display = "none";
    };
});



