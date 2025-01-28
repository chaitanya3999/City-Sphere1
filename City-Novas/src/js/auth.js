import authService from './custom-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const responsiveElements = document.querySelectorAll('.responsive-input');
    const loginErrorMessage = document.getElementById('login-error');

    // Responsive input handling
    responsiveElements.forEach(element => {
        element.addEventListener('focus', (e) => {
            e.target.classList.add('focused');
        });
        element.addEventListener('blur', (e) => {
            e.target.classList.remove('focused');
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phoneEmail = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const result = await authService.login(phoneEmail, password);
            
            // Handle successful login
            loginErrorMessage.textContent = '';
            alert('Login successful!');
            
            // Redirect based on user role or type
            window.location.href = result.userDetails.role === 'admin' 
                ? '/admin-dashboard.html' 
                : '/user-dashboard.html';
        } catch (error) {
            loginErrorMessage.textContent = error.message;
            console.error('Login Error:', error);
        }
    });

    // Responsive design adjustments
    function adjustLayoutForScreenSize() {
        const screenWidth = window.innerWidth;
        const container = document.querySelector('.auth-container');

        if (screenWidth < 768) {
            container.classList.add('mobile-view');
        } else {
            container.classList.remove('mobile-view');
        }
    }

    window.addEventListener('resize', adjustLayoutForScreenSize);
    adjustLayoutForScreenSize(); // Initial call
});
