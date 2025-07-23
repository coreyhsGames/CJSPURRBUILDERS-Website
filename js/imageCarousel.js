let slideIndex = 0;
let slideInterval;
let progressAnimation;
const slideDuration = 15000; // 3 seconds for demo (change to 30000 for 30s)

function startSlideShow() {
    resetAllProgress();
    showSlides();
}

function resetAllProgress() {
    const dots = document.querySelectorAll(".dot");
    const fills = document.querySelectorAll(".dot-fill");
    
    dots.forEach(dot => {
        dot.classList.remove("active");
    });
    
    fills.forEach(fill => {
        fill.style.width = "0%";
    });
}

function showSlides() {
    // Clear any existing animations
    cancelAnimationFrame(progressAnimation);
    clearInterval(slideInterval);
    
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.querySelectorAll(".dot");
    const fills = document.querySelectorAll(".dot-fill");
    
    // Reset all slides and dots
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        fills[i].style.width = "0%";
        dots[i].classList.remove("active");
    }
    
    // Handle wrap-around
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    
    // Show current slide
    slides[slideIndex].style.display = "block";
    dots[slideIndex].classList.add("active");
    
    // Animate fill
    const currentFill = fills[slideIndex];
    const startTime = Date.now();
    
    function animateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / slideDuration * 100, 100);
        currentFill.style.width = progress + "%";
        
        if (progress < 100) {
            progressAnimation = requestAnimationFrame(animateProgress);
        } else {
            // Move to next slide when progress completes
            slideIndex++;
            showSlides();
        }
    }
    
    animateProgress();
    
    // Set interval as backup
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlides();
    }, slideDuration);
}

function currentSlide(n) {
    slideIndex = n - 1;
    showSlides();
}

// Start the slideshow
startSlideShow();