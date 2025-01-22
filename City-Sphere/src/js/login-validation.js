import AuthService from './custom-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await AuthService.login(email, password);
            window.location.href = 'user-dashboard.html';
        } catch (error) {
            const errorElement = document.getElementById('loginError');
            if (errorElement) {
                errorElement.textContent = error.message || 'Login failed';
                errorElement.style.display = 'block';
            }
        }
    });
});
