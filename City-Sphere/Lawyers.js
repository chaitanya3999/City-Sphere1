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
            const specialty = btn.textContent.toLowerCase();
            filterLawyers(specialty);
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        // Add search logic here
        searchLawyers(searchTerm);
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
            loadMoreLawyers();
        });
    }

    // Book Consultation Button
    const consultBtns = document.querySelectorAll('.btn-consult');
    
    consultBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.lawyer-card');
            const name = card.querySelector('h3').textContent;
            const fee = card.querySelector('.consultation-fee').textContent;
            bookConsultation(name, fee);
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

    // Observe lawyer cards
    const lawyerCards = document.querySelectorAll('.lawyer-card');
    lawyerCards.forEach(card => {
        observer.observe(card);
    });

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Helper Functions
    function filterLawyers(specialty) {
        const lawyers = document.querySelectorAll('.lawyer-card');
        
        lawyers.forEach(lawyer => {
            const lawyerSpecialty = lawyer.querySelector('.specialty').textContent.toLowerCase();
            
            if (specialty === 'all' || lawyerSpecialty === specialty) {
                lawyer.style.display = 'block';
            } else {
                lawyer.style.display = 'none';
            }
        });
    }

    function searchLawyers(term) {
        const lawyers = document.querySelectorAll('.lawyer-card');
        
        lawyers.forEach(lawyer => {
            const name = lawyer.querySelector('h3').textContent.toLowerCase();
            const description = lawyer.querySelector('.description').textContent.toLowerCase();
            const specialty = lawyer.querySelector('.specialty').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term) || specialty.includes(term)) {
                lawyer.style.display = 'block';
            } else {
                lawyer.style.display = 'none';
            }
        });
    }

    function loadMoreLawyers() {
        // Example: Add 3 more lawyer cards
        const lawyersGrid = document.querySelector('.lawyers-grid');
        
        // Add loading state
        const loadMoreBtn = document.querySelector('.btn-load-more');
        loadMoreBtn.innerHTML = 'Loading... <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate loading delay
        setTimeout(() => {
            // Add new lawyer cards here
            // This is just an example - in a real app, you'd fetch data from a server
            
            // Reset button state
            loadMoreBtn.innerHTML = 'Load More <i class="fas fa-chevron-down"></i>';
        }, 1000);
    }

    function bookConsultation(name, fee) {
        // Add booking logic here
        showMessage(`Consultation request sent for ${name}!`, 'success');
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