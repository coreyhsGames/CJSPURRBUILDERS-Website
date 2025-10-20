const verticalNavBar = document.getElementById('vertical-nav-bar');

const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('close-btn');

// Fires when the hamburger button is clicked
hamburger.addEventListener('click', function () {
    verticalNavBar.style.width = "100%";
    hamburger.style.display = "none";
    closeBtn.style.display = "block";
});

// Fires when the vertical navbar close button is clicked
closeBtn.addEventListener('click', function () {
    verticalNavBar.style.width = "0%";
    hamburger.style.display = "block";
    closeBtn.style.display = "none";
});