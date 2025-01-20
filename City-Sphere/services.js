document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            navButtons.classList.toggle('active');
        });
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Add filter logic here
            const category = btn.textContent.toLowerCase();
            filterServices(category);
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        // Add search logic here
        searchServices(searchTerm);
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Load More Button
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Add load more logic here
            loadMoreServices();
        });
    }

    // Book Service Button
    const bookBtns = document.querySelectorAll('.btn-book');
    
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.service-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            bookService(name, price);
        });
    });

    // Animation Observer
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        observer.observe(card);
    });

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Helper Functions
    function filterServices(category) {
        const services = document.querySelectorAll('.service-card');
        
        services.forEach(service => {
            const serviceCategory = service.querySelector('.category').textContent.toLowerCase();
            
            if (category === 'all' || serviceCategory === category) {
                service.style.display = 'block';
            } else {
                service.style.display = 'none';
            }
        });
    }

    function searchServices(term) {
        const services = document.querySelectorAll('.service-card');
        
        services.forEach(service => {
            const name = service.querySelector('h3').textContent.toLowerCase();
            const description = service.querySelector('.description').textContent.toLowerCase();
            const provider = service.querySelector('.service-provider').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term) || provider.includes(term)) {
                service.style.display = 'block';
            } else {
                service.style.display = 'none';
            }
        });
    }

    function loadMoreServices() {
        // Example: Add 3 more service cards
        const servicesGrid = document.querySelector('.services-grid');
        
        // Add loading state
        const loadMoreBtn = document.querySelector('.btn-load-more');
        loadMoreBtn.innerHTML = 'Loading... <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate loading delay
        setTimeout(() => {
            // Add new service cards here
            // This is just an example - in a real app, you'd fetch data from a server
            
            // Reset button state
            loadMoreBtn.innerHTML = 'Load More <i class="fas fa-chevron-down"></i>';
        }, 1000);
    }

    function bookService(name, price) {
        // Add booking logic here
        showMessage(`Service booking request sent for ${name}!`, 'success');
    }

    function showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Add to document
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});
