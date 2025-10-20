document.addEventListener('DOMContentLoaded', function() {
    // Initialise all slideshows on page
    const slideshows = document.querySelectorAll('.slideshow-container');
    
    slideshows.forEach((container, index) => {
        // Unique ID for each slideshow
        const slideshowId = `slideshow-${index}`;
        container.id = slideshowId;
        
        // Initialise this slideshow
        initSlideshow(slideshowId);
    });
});

function initSlideshow(containerId) {
    let slideIndex = 0;
    let slideInterval;
    const slideDuration = 3000;
    
    const container = document.getElementById(containerId);
    const slides = container.querySelectorAll('.mySlides');
    const dots = container.querySelectorAll('.dot');
    const fills = container.querySelectorAll('.dot-fill');
    
    function showSlides() {
        // Reset all
        slides.forEach(slide => slide.style.display = "none");
        fills.forEach(fill => fill.style.width = "0%");
        
        // Handle wrap-around
        if (slideIndex >= slides.length) slideIndex = 0;
        if (slideIndex < 0) slideIndex = slides.length - 1;
        
        // Show current slide
        slides[slideIndex].style.display = "block";
        animateFill(fills[slideIndex]);
    }
    
    function animateFill(fillElement) {
        let startTime = Date.now();
        
        function updateProgress() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / slideDuration * 100, 100);
            fillElement.style.width = progress + "%";
            
            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                slideIndex++;
                showSlides();
            }
        }
        
        updateProgress();
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slideIndex = index;
            showSlides();
        });
    });
    
    // Start the slideshow
    showSlides();
}