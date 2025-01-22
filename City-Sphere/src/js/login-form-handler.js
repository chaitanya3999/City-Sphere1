import AuthService from './custom-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('[data-login-form]');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = loginForm.querySelector('#loginEmail');
            const passwordInput = loginForm.querySelector('#loginPassword');
            const errorElement = loginForm.querySelector('#loginError');
            
            try {
                await AuthService.login(emailInput.value, passwordInput.value);
                window.location.href = 'user-dashboard.html';
            } catch (error) {
                if (errorElement) {
                    errorElement.textContent = error.message || 'Login failed';
                    errorElement.style.display = 'block';
                }
            }
        });
    }
});
