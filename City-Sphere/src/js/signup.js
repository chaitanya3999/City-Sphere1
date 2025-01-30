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
            e.preventDefault(); // Prevent form from submitting normally
            showLoading();

            // Get form elements
            const phoneEmailInput = document.getElementById('phone-email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');

            // Validate inputs
            const phoneEmail = phoneEmailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            try {
                // Validation
                if (!validatePhoneOrEmail(phoneEmail)) {
                    throw new Error('Please enter a valid email address');
                }

                if (password.length < 8) {
                    throw new Error('Password must be at least 8 characters long');
                }

                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                console.log('Attempting to register user...');
                // Register user
                const response = await apiService.register({
                    name: phoneEmail.split('@')[0], // Use part before @ as name
                    email: phoneEmail,
                    password: password
                });

                console.log('Registration response:', response);

                if (response.success) {
                    // Clear form
                    signupForm.reset();
                    alert('Registration successful! Please login.');
                    // Redirect to login page
                    window.location.href = 'auth.html';
                } else {
                    throw new Error(response.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                hideLoading();
                const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
                alert(errorMessage);
                
                // Focus the relevant input field based on the error
                if (errorMessage.includes('email')) {
                    phoneEmailInput.focus();
                } else if (errorMessage.includes('password')) {
                    passwordInput.focus();
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
    // Regex for email only
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}
