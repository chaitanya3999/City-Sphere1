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
            filterRestaurants(category);
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        // Add search logic here
        searchRestaurants(searchTerm);
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
            loadMoreRestaurants();
        });
    }

    // Restaurant Card Animation
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    
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

    restaurantCards.forEach(card => {
        observer.observe(card);
    });

    // Feature Card Animation
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Helper Functions
    function filterRestaurants(category) {
        const restaurants = document.querySelectorAll('.restaurant-card');
        
        restaurants.forEach(restaurant => {
            const cuisine = restaurant.querySelector('.cuisine').textContent.toLowerCase();
            
            if (category === 'all' || cuisine.includes(category)) {
                restaurant.style.display = 'block';
            } else {
                restaurant.style.display = 'none';
            }
        });
    }

    function searchRestaurants(term) {
        const restaurants = document.querySelectorAll('.restaurant-card');
        
        restaurants.forEach(restaurant => {
            const name = restaurant.querySelector('h3').textContent.toLowerCase();
            const cuisine = restaurant.querySelector('.cuisine').textContent.toLowerCase();
            
            if (name.includes(term) || cuisine.includes(term)) {
                restaurant.style.display = 'block';
            } else {
                restaurant.style.display = 'none';
            }
        });
    }

    function loadMoreRestaurants() {
        // Example: Add 3 more restaurant cards
        const restaurantsGrid = document.querySelector('.restaurants-grid');
        
        // Add loading state
        const loadMoreBtn = document.querySelector('.btn-load-more');
        loadMoreBtn.innerHTML = 'Loading... <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate loading delay
        setTimeout(() => {
            // Add new restaurant cards here
            // This is just an example - in a real app, you'd fetch data from a server
            
            // Reset button state
            loadMoreBtn.innerHTML = 'Load More <i class="fas fa-chevron-down"></i>';
        }, 1000);
    }
});
