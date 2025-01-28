import authService from './custom-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signupErrorMessage = document.getElementById('signup-error');
    const responsiveElements = document.querySelectorAll('.responsive-input');

    // Responsive input handling
    responsiveElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('focused');
        });

        element.addEventListener('blur', () => {
            element.classList.remove('focused');
        });
    });

    // Signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phoneEmail = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate password match
        if (password !== confirmPassword) {
            signupErrorMessage.textContent = 'Passwords do not match';
            return;
        }

        try {
            const result = await authService.signup(phoneEmail, password, name);
            
            // Handle successful signup
            signupErrorMessage.textContent = '';
            alert('Signup successful!');
            
            // Redirect to dashboard or login page
            window.location.href = '/user-dashboard.html';
        } catch (error) {
            signupErrorMessage.textContent = error.message;
            console.error('Signup Error:', error);
        }
    });

    // Optional: Google Sign-In
    const googleSignInButton = document.getElementById('google-signin-btn');
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', async () => {
            try {
                // This would typically use Google's Sign-In API
                const googleToken = await googleSignIn(); // Implement this function
                const result = await authService.googleSignIn(googleToken);
                
                alert('Google Sign-In successful!');
                window.location.href = '/user-dashboard.html';
            } catch (error) {
                console.error('Google Sign-In Error:', error);
                alert('Google Sign-In failed');
            }
        });
    }
});
