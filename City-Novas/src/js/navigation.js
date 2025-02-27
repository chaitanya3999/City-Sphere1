document.addEventListener('DOMContentLoaded', () => {
    // Global responsive navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent default link behavior
            e.preventDefault();
            
            // Close mobile menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');

            // Get the href attribute
            const href = link.getAttribute('href');

            // Handle different types of links
            if (href.startsWith('#')) {
                // Scroll to section
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (href.endsWith('.html') || href === '/') {
                // Client-side routing for page navigation
                window.history.pushState({}, '', href);
                loadPage(href);
            }
        });
    });

    // Client-side page loading function
    function loadPage(url) {
        // Default to index.html if root
        if (url === '/') {
            url = '/index.html';
        }

        // Fetch the page content
        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Replace main content
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    // Create a temporary div to parse the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    
                    // Find the main content in the fetched HTML
                    const fetchedMainContent = tempDiv.querySelector('main');
                    
                    if (fetchedMainContent) {
                        mainContent.innerHTML = fetchedMainContent.innerHTML;
                    }
                }

                // Update page title
                const titleElement = document.querySelector('title');
                if (titleElement) {
                    const fetchedTitle = html.match(/<title>(.*?)<\/title>/);
                    if (fetchedTitle) {
                        titleElement.textContent = fetchedTitle[1];
                    }
                }

                // Re-run initialization scripts if needed
                initializePageScripts();
            })
            .catch(error => {
                console.error('Page load error:', error);
                // Fallback to full page reload
                window.location.href = url;
            });
    }

    // Function to initialize page-specific scripts
    function initializePageScripts() {
        // Re-run scripts for different pages
        if (document.getElementById('loginForm')) {
            // Login page scripts
            import('./auth.js');
        }
        if (document.getElementById('signupForm')) {
            // Signup page scripts
            import('./signup.js');
        }
        // Add more page-specific initializations as needed
    }

    // Add authentication and user profile handling
    const updateUserProfile = async () => {
        const userMenu = document.querySelector('.user-menu');
        if (!userMenu) return;
    
        try {
            const response = await fetch('/api/user/profile');
            const data = await response.json();
    
            if (data.user) {
                userMenu.innerHTML = `
                    <div class="user-dropdown">
                        <button class="dropdown-btn">
                            <i class="fas fa-user-circle"></i>
                            <span>${data.user.name}</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-content">
                            <a href="profile.html">
                                <i class="fas fa-user"></i> Profile
                            </a>
                            <a href="provider-dashboard.html">
                                <i class="fas fa-tachometer-alt"></i> Dashboard
                            </a>
                            <a href="#" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </div>
                    </div>
                `;
    
                // Add dropdown toggle functionality
                const dropdownBtn = document.querySelector('.dropdown-btn');
                const dropdownContent = document.querySelector('.dropdown-content');
    
                dropdownBtn?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownContent?.classList.toggle('show');
                });
    
                // Close dropdown when clicking outside
                document.addEventListener('click', () => {
                    dropdownContent?.classList.remove('show');
                });
    
                // Handle logout
                document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = 'index.html';
                    } catch (error) {
                        console.error('Logout failed:', error);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };
    
    // Initialize user profile on page load
    updateUserProfile();
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        const currentPath = window.location.pathname;
        loadPage(currentPath);
    });

    // Responsive navigation adjustments
    function adjustNavigation() {
        const screenWidth = window.innerWidth;

        if (screenWidth < 768) {
            navMenu.classList.add('mobile-nav');
            navToggle.style.display = 'block';
        } else {
            navMenu.classList.remove('mobile-nav');
            navToggle.style.display = 'none';
            navMenu.classList.remove('active');
        }
    }

    // Authentication state management
    function checkAuthenticationStatus() {
        const token = localStorage.getItem('authToken');
        const authLinks = document.querySelectorAll('.auth-link');
        const guestLinks = document.querySelectorAll('.guest-link');

        if (token) {
            // User is logged in
            authLinks.forEach(link => link.style.display = 'block');
            guestLinks.forEach(link => link.style.display = 'none');
        } else {
            // User is not logged in
            authLinks.forEach(link => link.style.display = 'none');
            guestLinks.forEach(link => link.style.display = 'block');
        }
    }

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear authentication data from localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            
            // Redirect to home or login page
            window.location.href = '/index.html';
        });
    }

    // Initial setup
    adjustNavigation();
    checkAuthenticationStatus();

    // Resize listener
    window.addEventListener('resize', adjustNavigation);
});
