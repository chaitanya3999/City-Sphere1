import apiService from './services/api.service.js';

document.addEventListener('DOMContentLoaded', async function() {
    const signupForm = document.getElementById('signup-form');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Show/hide loading overlay
    const showLoading = () => loadingOverlay?.classList.remove('hide');
    const hideLoading = () => loadingOverlay?.classList.add('hide');

    // Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();

            // Get form elements
            const phoneEmailInput = document.getElementById('phone-email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');

            // Validate inputs
            const phoneEmail = phoneEmailInput?.value?.trim();
            const password = passwordInput?.value;
            const confirmPassword = confirmPasswordInput?.value;

            try {
                // Input validation
                if (!phoneEmail) {
                    throw new Error('Email address is required');
                }

                if (!validatePhoneOrEmail(phoneEmail)) {
                    throw new Error('Please enter a valid email address');
                }

                if (!password) {
                    throw new Error('Password is required');
                }

                if (password.length < 8) {
                    throw new Error('Password must be at least 8 characters long');
                }

                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                // Generate a user-friendly name from email
                const name = phoneEmail.split('@')[0]
                    .replace(/[^a-zA-Z0-9]/g, ' ') // Replace special chars with space
                    .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
                    .trim()                        // Remove leading/trailing spaces
                    .toLowerCase()                 // Convert to lowercase
                    .split(' ')                    // Split into words
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
                    .join(' ');                    // Join words back together

                console.log('Attempting to register user with data:', {
                    name,
                    email: phoneEmail
                });

                // Register user
                const response = await apiService.register({
                    name,
                    email: phoneEmail,
                    password: password
                });

                console.log('Registration response:', response);

                if (response.success) {
                    // Clear form
                    signupForm.reset();
                    alert('Registration successful! Please login.');
                    
                    // Redirect to login page
                    window.location.href = '/City-Sphere1/City-Sphere/src/html/auth.html';
                } else {
                    throw new Error(response.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                
                // Clear password fields for security
                if (passwordInput) passwordInput.value = '';
                if (confirmPasswordInput) confirmPasswordInput.value = '';
                
                // Show error message
                const errorMessage = error.message || 'Registration failed. Please try again.';
                alert(errorMessage);
                
                // Focus the relevant input field based on the error
                if (errorMessage.toLowerCase().includes('email')) {
                    phoneEmailInput?.focus();
                } else if (errorMessage.toLowerCase().includes('password')) {
                    passwordInput?.focus();
                }
            } finally {
                hideLoading();
            }
        });
    }

    // Social Sign Up Handlers
    const googleSignupBtn = document.querySelector('.btn-google');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                showLoading();
                // The actual Google sign-in is handled by the Google Sign-In API
                // This is just a placeholder for any additional handling
                console.log('Google Sign-In clicked');
            } catch (error) {
                hideLoading();
                console.error('Google signup error:', error);
                alert('Google sign-up failed. Please try again.');
            }
        });
    }
});

// Validation Helper
function validatePhoneOrEmail(input) {
    if (!input) return false;
    
    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(input);
}
