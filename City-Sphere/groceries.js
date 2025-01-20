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
            filterGroceries(category);
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        // Add search logic here
        searchGroceries(searchTerm);
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
            loadMoreGroceries();
        });
    }

    // Quantity Selectors
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const quantityElement = this.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (this.classList.contains('decrease')) {
                if (quantity > 1) quantity--;
            } else {
                quantity++;
            }
            
            quantityElement.textContent = quantity;
        });
    });

    // Add to Cart Button
    const addToCartBtns = document.querySelectorAll('.btn-add');
    let cartTotal = 0;
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.grocery-card');
            const name = card.querySelector('h3').textContent;
            const price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
            const quantity = parseInt(card.querySelector('.quantity').textContent);
            
            addToCart(name, price, quantity);
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

    // Observe grocery cards
    const groceryCards = document.querySelectorAll('.grocery-card');
    groceryCards.forEach(card => {
        observer.observe(card);
    });

    // Helper Functions
    function filterGroceries(category) {
        const groceries = document.querySelectorAll('.grocery-card');
        
        groceries.forEach(grocery => {
            const groceryCategory = grocery.querySelector('.category').textContent.toLowerCase();
            
            if (category === 'all' || groceryCategory === category) {
                grocery.style.display = 'block';
            } else {
                grocery.style.display = 'none';
            }
        });
    }

    function searchGroceries(term) {
        const groceries = document.querySelectorAll('.grocery-card');
        
        groceries.forEach(grocery => {
            const name = grocery.querySelector('h3').textContent.toLowerCase();
            const description = grocery.querySelector('.description').textContent.toLowerCase();
            const store = grocery.querySelector('.store-name').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term) || store.includes(term)) {
                grocery.style.display = 'block';
            } else {
                grocery.style.display = 'none';
            }
        });
    }

    function loadMoreGroceries() {
        // Example: Add 3 more grocery cards
        const groceriesGrid = document.querySelector('.groceries-grid');
        
        // Add loading state
        const loadMoreBtn = document.querySelector('.btn-load-more');
        loadMoreBtn.innerHTML = 'Loading... <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate loading delay
        setTimeout(() => {
            // Add new grocery cards here
            // This is just an example - in a real app, you'd fetch data from a server
            
            // Reset button state
            loadMoreBtn.innerHTML = 'Load More <i class="fas fa-chevron-down"></i>';
        }, 1000);
    }

    function addToCart(name, price, quantity) {
        const itemTotal = price * quantity;
        cartTotal += itemTotal;
        
        // Update cart total display
        const cartTotalElement = document.querySelector('.cart-total span');
        if (cartTotalElement) {
            cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
        }
        
        showMessage(`Added ${quantity} ${name} to cart!`, 'success');
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

    // Checkout Button
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartTotal > 0) {
                showMessage('Proceeding to checkout...', 'success');
                // Add checkout logic here
            } else {
                showMessage('Your cart is empty!', 'error');
            }
        });
    }
});
