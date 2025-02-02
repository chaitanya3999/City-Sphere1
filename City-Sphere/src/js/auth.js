import apiService from './services/api.service.js';

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is already logged in
    try {
        const isAuthenticated = await apiService.checkAuth();
        if (isAuthenticated) {
            window.location.replace('/src/html/user-dashboard.html');
            return;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }

    const loginForm = document.getElementById('loginForm');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Show/hide loading overlay
    const showLoading = () => loadingOverlay?.classList.remove('hide');
    const hideLoading = () => loadingOverlay?.classList.add('hide');

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                console.log('Attempting login...');
                const response = await apiService.login(email, password);
                console.log('Login response:', response);

                if (response.success) {
                    console.log('Login successful, attempting to redirect...');
                    // Clear form
                    loginForm.reset();
                    
                    // Store user data in localStorage
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token);
                    
                    // Redirect to dashboard using replace
                    console.log('Redirecting to dashboard...');
                    window.location.replace('/src/html/user-dashboard.html');
                } else {
                    throw new Error(response.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                hideLoading();
                const errorMessage = error.message || 'Login failed. Please try again.';
                alert(errorMessage);
            } finally {
                hideLoading();
            }
        });
    } else {
        console.error('Login form not found!');
    }

    // Handle forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            // TODO: Implement forgot password functionality
            alert('Forgot password functionality coming soon!');
        });
    }
});