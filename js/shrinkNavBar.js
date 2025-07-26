document.addEventListener('DOMContentLoaded', function() {
    const navBar = document.querySelector('.nav-bar-horizontal');
    const logo = document.querySelector('.logo');
    
    // Set the scroll threshold for when the navbar should shrink
    const scrollThreshold = 300;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            navBar.classList.add('shrink');
        } else {
            navBar.classList.remove('shrink');
        }
    });
});