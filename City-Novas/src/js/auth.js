document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Basic client-side validation
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Basic email validation
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        // Basic password validation
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        try {
            // Simulated login (replace with actual authentication logic)
            const response = await simulateLogin(email, password);
            
            if (response.success) {
                // Redirect to dashboard or home page
                window.location.href = 'provider-dashboard.html';
            } else {
                alert(response.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Simulated login function (replace with actual backend authentication)
    async function simulateLogin(email, password) {
        // This is a mock implementation
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // Basic mock credentials (replace with real authentication)
                if (email === 'user@citynovas.com' && password === 'password123') {
                    resolve({ 
                        success: true, 
                        token: 'mock-jwt-token',
                        user: { 
                            name: 'City Novas User', 
                            email: email 
                        }
                    });
                } else {
                    resolve({ 
                        success: false, 
                        message: 'Invalid email or password' 
                    });
                }
            }, 1000);
        });
    }

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password reset functionality coming soon!');
        });
    }
});
