/* Slider Logic */
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;

    function goToSlide(n) {
        // Wrap around
        if (n >= slideCount) currentSlide = 0;
        else if (n < 0) currentSlide = slideCount - 1;
        else currentSlide = n;

        // Update Slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            // Remove transform style to reset zoom animation on inactive
            slide.querySelectorAll('.hero-bg-overlay').forEach(overlay => {
                overlay.style.transition = 'none';
                overlay.style.transform = 'scale(1)';
            });
        });

        // Activate new slide
        slides[currentSlide].classList.add('active');

        // Re-enable transition for zoom effect
        setTimeout(() => {
            const activeOverlay = slides[currentSlide].querySelector('.hero-bg-overlay');
            if (activeOverlay) {
                activeOverlay.style.transition = 'transform 6s ease-out';
                activeOverlay.style.transform = 'scale(1.05)';
            }
        }, 50);

        // Update Dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Start Auto Slider
    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000); // 5 seconds
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Event Listeners for Dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopSlider();
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            goToSlide(slideIndex);
            startSlider();
        });
    });

    // Initialize Slider
    if (slides.length > 0) {
        startSlider();
        // Trigger initial zoom
        const firstOverlay = slides[0].querySelector('.hero-bg-overlay');
        if (firstOverlay) {
            setTimeout(() => {
                firstOverlay.style.transition = 'transform 6s ease-out';
                firstOverlay.style.transform = 'scale(1.05)';
            }, 50);
        }
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get button reference
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            // Show loading state
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Message Sent Successfully! We will get back to you shortly.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }
});
