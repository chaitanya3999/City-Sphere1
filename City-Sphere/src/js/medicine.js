// Search functionality
function searchMedicine() {
    const searchInput = document.getElementById("searchInput").value;
    if (searchInput.trim() !== "") {
      alert(Searching for "${searchInput}"...);
    } else {
      alert("Please enter a search term.");
    }
  }

  // Select category
  function selectCategory(category) {
    document.getElementById("category").value = category;
    alert(Selected category: ${category});
  }

  // Submit order form
  function submitOrder(event) {
    event.preventDefault();
    const form = document.getElementById("medicineForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    alert(Order Submitted:\n${JSON.stringify(data, null, 2)});
  }

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
            filterMedicines(category);
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        // Add search logic here
        searchMedicines(searchTerm);
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

    // Prescription Upload
    const prescriptionUpload = document.getElementById('prescription-upload');
    const uploadBox = document.querySelector('.upload-box');

    if (prescriptionUpload && uploadBox) {
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('drag-over');
        });

        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('drag-over');
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            handlePrescriptionUpload(files);
        });

        prescriptionUpload.addEventListener('change', (e) => {
            const files = e.target.files;
            handlePrescriptionUpload(files);
        });
    }

    // Load More Button
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Add load more logic here
            loadMoreMedicines();
        });
    }

    // Add to Cart Functionality
    const addToCartBtns = document.querySelectorAll('.btn-add');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.medicine-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            addToCart(name, price);
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

    // Observe medicine cards
    const medicineCards = document.querySelectorAll('.medicine-card');
    medicineCards.forEach(card => {
        observer.observe(card);
    });

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Helper Functions
    function filterMedicines(category) {
        const medicines = document.querySelectorAll('.medicine-card');
        
        medicines.forEach(medicine => {
            const medicineCategory = medicine.querySelector('.category').textContent.toLowerCase();
            
            if (category === 'all' || medicineCategory === category) {
                medicine.style.display = 'block';
            } else {
                medicine.style.display = 'none';
            }
        });
    }

    function searchMedicines(term) {
        const medicines = document.querySelectorAll('.medicine-card');
        
        medicines.forEach(medicine => {
            const name = medicine.querySelector('h3').textContent.toLowerCase();
            const description = medicine.querySelector('.description').textContent.toLowerCase();
            const manufacturer = medicine.querySelector('.manufacturer').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term) || manufacturer.includes(term)) {
                medicine.style.display = 'block';
            } else {
                medicine.style.display = 'none';
            }
        });
    }

    function handlePrescriptionUpload(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                // Show upload success message
                showMessage('Prescription uploaded successfully!', 'success');
                // Here you would typically upload the file to your server
            } else {
                showMessage('Please upload an image or PDF file.', 'error');
            }
        }
    }

    function loadMoreMedicines() {
        // Example: Add 3 more medicine cards
        const medicinesGrid = document.querySelector('.medicine-grid');
        
        // Add loading state
        const loadMoreBtn = document.querySelector('.btn-load-more');
        loadMoreBtn.innerHTML = 'Loading... <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate loading delay
        setTimeout(() => {
            // Add new medicine cards here
            // This is just an example - in a real app, you'd fetch data from a server
            
            // Reset button state
            loadMoreBtn.innerHTML = 'Load More <i class="fas fa-chevron-down"></i>';
        }, 1000);
    }

    function addToCart(name, price) {
        // Add to cart logic here
        showMessage(`${name} added to cart!`, 'success');
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