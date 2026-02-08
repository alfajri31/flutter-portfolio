$(document).ready(function() {
    let counter = 0;
    let slides = document.getElementsByClassName("mySlides");
    setInterval(function() {
        if(counter===3) {
            counter = 0;
        }
        if(counter === 0) {
            slides[0].style.display = "block";
            slides[1].style.display = "none";
            slides[2].style.display = "none";
        }
        else if(counter === 1) {
            slides[0].style.display = "none";
            slides[1].style.display=  "block";
            slides[2].style.display = "none";
        }
        else if(counter === 2) {
            slides[0].style.display = "none";
            slides[1].style.display = "none";
            slides[2].style.display = "block";
        }
        counter=counter+1;
    },1500)
});
