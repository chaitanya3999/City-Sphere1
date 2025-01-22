// Cache DOM elements
const elements = {
    greeting: document.getElementById('greeting'),
    time: document.getElementById('time'),
    date: document.getElementById('date'),
    hamburger: document.querySelector('.hamburger'),
    navWrapper: document.querySelector('.nav-wrapper'),
    serviceCards: document.querySelectorAll('.service-card'),
    featureCards: document.querySelectorAll('.feature-card'),
    authSection: document.getElementById('authSection')
};

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update greeting based on time of day
function updateGreeting() {
    try {
        const hour = new Date().getHours();
        
        let greetingText;
        if (hour >= 0 && hour < 12) {
            greetingText = 'Good Morning!';
        } else if (hour >= 12 && hour < 18) {
            greetingText = 'Good Afternoon!';
        } else if (hour >= 18 && hour <= 23) {
            greetingText = 'Good Evening!';
        }

        if (elements.greeting) {
            elements.greeting.textContent = greetingText;
        }
    } catch (error) {
        console.error('Error updating greeting:', error);
    }
}

// Update time and date with performance optimization
const updateDateTime = debounce(() => {
    try {
        const now = new Date();

        if (elements.time) {
            elements.time.textContent = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        if (elements.date) {
            elements.date.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
        }
    } catch (error) {
        console.error('Error updating date/time:', error);
    }
}, 1000);

// Mobile menu functionality with improved touch handling
function initMobileMenu() {
    if (!elements.hamburger || !elements.navWrapper) return;

    const toggleMenu = () => {
        elements.hamburger.classList.toggle('active');
        elements.navWrapper.classList.toggle('active');
    };

    elements.hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.navWrapper.classList.contains('active') &&
            !elements.hamburger.contains(e.target) && 
            !elements.navWrapper.contains(e.target)) {
            toggleMenu();
        }
    });

    // Handle touch events
    document.addEventListener('touchstart', (e) => {
        if (elements.navWrapper.classList.contains('active') &&
            !elements.hamburger.contains(e.target) && 
            !elements.navWrapper.contains(e.target)) {
            toggleMenu();
        }
    }, { passive: true });
}

// Scroll animations with Intersection Observer and performance optimization
function initScrollAnimations() {
    if (!elements.serviceCards.length && !elements.featureCards.length) return;

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation to save resources
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    [...elements.serviceCards, ...elements.featureCards].forEach(element => {
        observer.observe(element);
    });
}

// Smooth scroll with performance optimization
const smoothScroll = debounce((target) => {
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}, 100);

import AuthService from './custom-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        hamburger: document.querySelector('.hamburger'),
        navWrapper: document.querySelector('.nav-wrapper'),
        serviceCards: document.querySelectorAll('.service-card'),
        featureCards: document.querySelectorAll('.feature-card'),
        authSection: document.getElementById('authSection'),
        greeting: document.getElementById('greeting')
    };

    // Authentication State Management
    function updateAuthState() {
        const isAuthenticated = AuthService.isAuthenticated();
        const userData = JSON.parse(localStorage.getItem('userSignupData') || '{}');

        if (isAuthenticated) {
            const profilePicUrl = userData.profilePicture || '../images/default-avatar.png';

            // Update navigation with profile picture
            elements.authSection.innerHTML = `
                <a href="user-dashboard.html" class="profile-link">
                    <img src="${profilePicUrl}" alt="Profile" class="profile-pic">
                    <span>${userData.name || 'User'}</span>
                </a>
                <button onclick="window.logout()" class="btn-logout">Logout</button>
            `;

            // Update greeting
            if (elements.greeting) {
                const currentHour = new Date().getHours();
                let greeting = 'Hello';

                if (currentHour >= 0 && currentHour < 12) {
                    greeting = 'Good Morning';
                } else if (currentHour >= 12 && currentHour < 18) {
                    greeting = 'Good Afternoon';
                } else if (currentHour >= 18 && currentHour <= 23) {
                    greeting = 'Good Evening';
                }

                elements.greeting.innerHTML = `
                    <h1>${greeting}, ${userData.name || 'User'}!</h1>
                    <p>Welcome back to City Sphere</p>
                `;
            }
        } else {
            // User is signed out
            elements.authSection.innerHTML = `
                <a href="auth.html" class="btn btn-login">
                    <i class="fas fa-user"></i>Login
                </a>
            `;

            // Reset greeting
            if (elements.greeting) {
                elements.greeting.innerHTML = `
                    <h1>Welcome to City Sphere</h1>
                    <p>Your Urban Services Platform</p>
                `;
            }
        }
    }

    // Global logout function
    window.logout = () => {
        AuthService.logout();
    };

    // Initial auth state update
    updateAuthState();

    try {
        updateGreeting();
        updateDateTime();
        initMobileMenu();
        initScrollAnimations();

        // Update time every minute instead of every second for better performance
        setInterval(updateDateTime, 60000);
        // Update greeting every hour
        setInterval(updateGreeting, 3600000);

        // Smooth scroll functionality
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    smoothScroll(target);
                }
            });
        });

        // Hamburger menu toggle
        if (elements.hamburger && elements.navWrapper) {
            elements.hamburger.addEventListener('click', () => {
                elements.navWrapper.classList.toggle('active');
            });
        }

        // Service cards hover effect
        elements.serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hovered');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hovered');
            });
        });

        // Feature cards hover effect
        elements.featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hovered');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hovered');
            });
        });

        // Newsletter subscription
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                // Show success message
                showNotification('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            });
        }

        // Notification system
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Trigger animation
            setTimeout(() => notification.classList.add('show'), 10);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        }
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

// Add service worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.error('ServiceWorker registration failed:', error);
            });
    });
}
