// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        let imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.add('loaded');
                    imageObserver.unobserve(image);
                }
            });
        }, {
            rootMargin: "0px 0px 50px 0px"
        });

        lazyImages.forEach(image => imageObserver.observe(image));
    }
});

// Global Error Handling
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
    // Optionally send error to logging service
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const timing = window.performance.timing;
        console.log('Page Load Time:', timing.loadEventEnd - timing.navigationStart, 'ms');
    });
}
