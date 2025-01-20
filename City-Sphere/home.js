// Update greeting based on time of day
function updateGreeting() {
    const hour = new Date().getHours();
    const greeting = document.getElementById('greeting');
    
    if (hour >= 5 && hour < 12) {
        greeting.textContent = 'Good Morning!';
    } else if (hour >= 12 && hour < 17) {
        greeting.textContent = 'Good Afternoon!';
    } else if (hour >= 17 && hour < 22) {
        greeting.textContent = 'Good Evening!';
    } else {
        greeting.textContent = 'Good Night!';
    }
}

// Update time and date
function updateDateTime() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const now = new Date();

    // Format time
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Format date
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    timeElement.textContent = timeString;
    dateElement.textContent = dateString;
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navContent = document.querySelector('.nav-wrapper');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navContent.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navContent.contains(e.target)) {
            hamburger.classList.remove('active');
            navContent.classList.remove('active');
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateGreeting();
    updateDateTime();
    initMobileMenu();
    initScrollAnimations();

    // Update time every minute
    setInterval(updateDateTime, 60000);
    // Update greeting every hour
    setInterval(updateGreeting, 3600000);
});

// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
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

// Login and Register redirects
function redirectToLogin() {
    window.location.href = 'Register-Login.html';
}

function redirectToSignUp() {
    window.location.href = 'Register-Login.html';
}
