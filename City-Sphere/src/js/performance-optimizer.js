// Performance Optimization Module
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy loading for images
        this.initLazyLoading();

        // Debounce scroll and resize events
        this.optimizeEventListeners();

        // Preload critical resources
        this.preloadCriticalResources();

        // Monitor performance
        this.monitorPerformance();
    }

    initLazyLoading() {
        // Intersection Observer for lazy loading images
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.add('loaded');
                        observer.unobserve(lazyImage);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without Intersection Observer
            this.fallbackLazyLoading();
        }
    }

    fallbackLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        function checkScroll() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top < window.innerHeight) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
            });
        }

        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        checkScroll(); // Initial check
    }

    optimizeEventListeners() {
        // Debounce function to limit rate of function calls
        function debounce(func, wait = 20, immediate = true) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }

        // Example of debounced scroll event
        window.addEventListener('scroll', debounce(() => {
            // Perform scroll-related optimizations
            console.log('Optimized scroll event');
        }));
    }

    preloadCriticalResources() {
        // Preload key resources
        const criticalResources = [
            '/src/css/home.css',
            '/src/js/home.js',
            '/City Sphere Final copy.png'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 
                      resource.endsWith('.js') ? 'script' : 
                      resource.endsWith('.png') ? 'image' : 'fetch';
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        // Use Performance API to log key metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const metrics = performance.getEntriesByType('navigation')[0];
                
                console.group('Page Load Performance');
                console.log('DNS Lookup:', metrics.domainLookupEnd - metrics.domainLookupStart, 'ms');
                console.log('TCP Connection:', metrics.connectEnd - metrics.connectStart, 'ms');
                console.log('Time to First Byte:', metrics.responseStart - metrics.requestStart, 'ms');
                console.log('DOM Load:', metrics.domComplete - metrics.domLoading, 'ms');
                console.log('Full Page Load:', metrics.loadEventEnd - metrics.loadEventStart, 'ms');
                console.groupEnd();

                // Send performance data to analytics (placeholder)
                this.sendPerformanceData(metrics);
            });
        }
    }

    sendPerformanceData(metrics) {
        // Placeholder for sending performance metrics to analytics service
        // In a real-world scenario, you'd send this to Google Analytics, 
        // New Relic, or a custom analytics endpoint
        const performanceData = {
            dnsLookup: metrics.domainLookupEnd - metrics.domainLookupStart,
            tcpConnection: metrics.connectEnd - metrics.connectStart,
            timeToFirstByte: metrics.responseStart - metrics.requestStart,
            domLoad: metrics.domComplete - metrics.domLoading,
            fullPageLoad: metrics.loadEventEnd - metrics.loadEventStart
        };

        console.log('Performance data ready to be sent:', performanceData);
    }
}

// Initialize performance optimizer when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});
