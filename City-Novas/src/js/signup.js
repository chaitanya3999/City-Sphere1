document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const googleSignupBtn = document.querySelector('.btn-google');

    // Google Signup
    googleSignupBtn.addEventListener('click', () => {
        // Placeholder for Google Sign-In
        alert('Google Sign-In coming soon!');
    });

    // Form Submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form elements
        const phoneEmailInput = document.getElementById('phone-email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        // Validate inputs
        const phoneEmail = phoneEmailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validation
        if (!validatePhoneOrEmail(phoneEmail)) {
            alert('Please enter a valid phone number or email');
            phoneEmailInput.focus();
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            passwordInput.focus();
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            confirmPasswordInput.focus();
            return;
        }

        // Collect form data
        const signupData = {
            phoneEmail: phoneEmail,
            password: password
        };

        // Simulate registration (replace with actual backend call)
        registerUser(signupData);
    });

    // Validation Helpers
    function validatePhoneOrEmail(input) {
        // Regex for phone number (10 digits) or email
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return phoneRegex.test(input) || emailRegex.test(input);
    }

    // Registration Function
    function registerUser(userData) {
        // Simulate user registration
        console.log('User Registration Data:', userData);

        // In a real scenario, this would be an API call
        try {
            // Simulated successful registration
            alert('Account created successfully!');
            
            // Store user data (replace with proper authentication mechanism)
            localStorage.setItem('userData', JSON.stringify(userData));

            // Redirect to dashboard or next step
            window.location.href = 'provider-registration.html';
        } catch (error) {
            console.error('Registration Error:', error);
            alert('Registration failed. Please try again.');
        }
    }
});
