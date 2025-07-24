document.addEventListener('DOMContentLoaded', function() {
    // Initialize all slideshows on page
    const slideshows = document.querySelectorAll('.slideshow-container');
    
    slideshows.forEach((container, index) => {
        // Unique ID for each slideshow
        const slideshowId = `slideshow-${index}`;
        container.id = slideshowId;
        
        // Initialize this slideshow
        initSlideshow(slideshowId);
    });
});

function initSlideshow(containerId) {
    let slideIndex = 0;
    let slideInterval;
    let animationFrame;
    const slideDuration = 3000;
    
    const container = document.getElementById(containerId);
    const slides = container.querySelectorAll('.mySlides');
    const dots = container.querySelectorAll('.dot');
    const fills = container.querySelectorAll('.dot-fill');
    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    
    function showSlides() {
        // Reset all
        slides.forEach(slide => slide.style.display = "none");
        fills.forEach(fill => {
            fill.style.width = "0%";
            fill.style.transition = "none"; // Reset transition for immediate change
        });
        
        // Handle wrap-around
        if (slideIndex >= slides.length) slideIndex = 0;
        if (slideIndex < 0) slideIndex = slides.length - 1;
        
        // Show current slide
        slides[slideIndex].style.display = "block";
        animateFill(fills[slideIndex]);
    }
    
    function animateFill(fillElement) {
        // Cancel any existing animation
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        let startTime = Date.now();
        
        function updateProgress() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / slideDuration * 100, 100);
            fillElement.style.width = progress + "%";
            
            if (progress < 100) {
                animationFrame = requestAnimationFrame(updateProgress);
            } else {
                slideIndex++;
                showSlides();
            }
        }
        
        // Add smooth transition for the fill
        fillElement.style.transition = "width " + slideDuration + "ms linear";
        fillElement.style.width = "100%";
        
        // Set timeout for next slide
        clearTimeout(slideInterval);
        slideInterval = setTimeout(() => {
            slideIndex++;
            showSlides();
        }, slideDuration);
    }
    
    // Navigation functions
    function plusSlides(n) {
        slideIndex += n;
        showSlides();
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slideIndex = index;
            showSlides();
        });
    });
    
    // Previous/Next button handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => plusSlides(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => plusSlides(1));
    }
    
    // Start the slideshow
    showSlides();
}