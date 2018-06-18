$(window).scroll(function () {
    const box = $(".titleBox");
    const h = box.height();
    box.css("opacity", 1 - $(window).scrollTop() / h);
});

$(document).ready(function() {
    const projectModal = document.getElementById("projectModal");
    const projectImgs = document.getElementsByClassName("projectImg");
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("caption");
    console.log(projectImgs);

    for (let i = 0, len = projectImgs.length; i < len; i++) {
        const projectImg = projectImgs[i];

        projectImg.onclick = function () {
            projectModal.style.display = "block";
            modalImg.src = projectImg.src;
            captionText.innerHTML = projectImg.alt;
        }
    }

    const span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        projectModal.style.display = "none";
    };

    projectModal.onclick = function () {
        projectModal.style.display = "none";
    };
});