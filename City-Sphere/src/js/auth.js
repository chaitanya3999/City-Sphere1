document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form elements
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Validate inputs
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validation
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            emailInput.focus();
            return;
        }

        // Simulate login (replace with actual backend call)
        loginUser(email, password);
    });

    // Validation Helpers
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Login Function
    function loginUser(email, password) {
        // Simulate user login
        console.log('User Login Data:', { email, password });

        // In a real scenario, this would be an API call
        try {
            // Simulated successful login
            alert('Login successful!');
            
            // Store user data (replace with proper authentication mechanism)
            localStorage.setItem('userEmail', email);

            // Redirect to dashboard or next step
            window.location.href = 'user-dashboard.html';
        } catch (error) {
            console.error('Login Error:', error);
            alert('Login failed. Please try again.');
        }
    }

    // Forgot Password
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Forgot Password functionality coming soon!');
    });
});
