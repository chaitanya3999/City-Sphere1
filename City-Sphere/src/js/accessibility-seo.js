// Accessibility and SEO Enhancement Module
class AccessibilityAndSEO {
    constructor() {
        this.init();
    }

    init() {
        // Run all enhancement methods
        this.improveKeyboardNavigation();
        this.addAriaAttributes();
        this.enhanceSemantics();
        this.setupSkipLinks();
        this.colorContrastCheck();
        this.generateStructuredData();
    }

    improveKeyboardNavigation() {
        // Ensure all interactive elements are focusable and have clear focus states
        document.addEventListener('DOMContentLoaded', () => {
            const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
            
            interactiveElements.forEach(el => {
                // Add tabindex if not already present
                if (!el.getAttribute('tabindex')) {
                    el.setAttribute('tabindex', '0');
                }

                // Improve focus visibility
                el.addEventListener('focus', () => {
                    el.classList.add('focused');
                });

                el.addEventListener('blur', () => {
                    el.classList.remove('focused');
                });
            });
        });
    }

    addAriaAttributes() {
        document.addEventListener('DOMContentLoaded', () => {
            // Add ARIA labels to improve screen reader experience
            const elementsNeedingLabels = [
                { selector: 'nav', role: 'navigation' },
                { selector: 'main', role: 'main' },
                { selector: 'header', role: 'banner' },
                { selector: 'footer', role: 'contentinfo' }
            ];

            elementsNeedingLabels.forEach(({ selector, role }) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.setAttribute('role', role);
                });
            });

            // Improve form accessibility
            const formInputs = document.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                const label = input.labels && input.labels[0];
                if (label) {
                    input.setAttribute('aria-label', label.textContent);
                }
            });
        });
    }

    enhanceSemantics() {
        document.addEventListener('DOMContentLoaded', () => {
            // Replace generic divs with semantic HTML5 elements where appropriate
            const semanticReplacements = [
                { old: '.service-section', new: 'section' },
                { old: '.service-list', new: 'nav' }
            ];

            semanticReplacements.forEach(({ old, new: newTag }) => {
                const elements = document.querySelectorAll(old);
                elements.forEach(el => {
                    const semanticEl = document.createElement(newTag);
                    // Copy attributes and children
                    Array.from(el.attributes).forEach(attr => {
                        semanticEl.setAttribute(attr.name, attr.value);
                    });
                    while (el.firstChild) {
                        semanticEl.appendChild(el.firstChild);
                    }
                    el.parentNode.replaceChild(semanticEl, el);
                });
            });
        });
    }

    setupSkipLinks() {
        // Create skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.classList.add('skip-link');
        
        // Ensure it's the first element in the body
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Ensure main content has an id
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    }

    colorContrastCheck() {
        // Basic color contrast checking
        function checkContrast(foreground, background) {
            const getLuminance = (color) => {
                const rgb = color.match(/\d+/g).map(Number);
                const [r, g, b] = rgb.map(c => {
                    c /= 255;
                    return c <= 0.03928 
                        ? c / 12.92 
                        : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            };

            const contrast = (l1, l2) => {
                const lighter = Math.max(l1, l2);
                const darker = Math.min(l1, l2);
                return (lighter + 0.05) / (darker + 0.05);
            };

            const fgLum = getLuminance(foreground);
            const bgLum = getLuminance(background);
            const contrastRatio = contrast(fgLum, bgLum);

            // WCAG 2.0 level AA requires a contrast ratio of at least 4.5:1
            return contrastRatio >= 4.5;
        }

        document.addEventListener('DOMContentLoaded', () => {
            const elementsToCheck = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span');
            
            elementsToCheck.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                const color = computedStyle.color;
                const backgroundColor = computedStyle.backgroundColor;

                if (!checkContrast(color, backgroundColor)) {
                    console.warn('Low color contrast detected:', el, {
                        foreground: color,
                        background: backgroundColor
                    });
                    // Optionally add a visual indicator
                    el.classList.add('low-contrast');
                }
            });
        });
    }

    generateStructuredData() {
        // Generate JSON-LD structured data for SEO
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "City Sphere",
            "url": window.location.origin,
            "description": "Comprehensive urban services platform",
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${window.location.origin}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityAndSEO();
});
