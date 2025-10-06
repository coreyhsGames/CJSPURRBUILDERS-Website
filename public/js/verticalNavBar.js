const verticalNavBar = document.getElementById('vertical-nav-bar');

const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('close-btn');

hamburger.addEventListener('click', function () {
    verticalNavBar.style.width = "100%";
    hamburger.style.display = "none";
    closeBtn.style.display = "block";
});

closeBtn.addEventListener('click', function () {
    verticalNavBar.style.width = "0%";
    hamburger.style.display = "block";
    closeBtn.style.display = "none";
});