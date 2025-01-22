import AuthService from './custom-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const profilePictureInput = document.getElementById('profilePictureUpload');

    // Profile Picture Preview and Storage
    let selectedProfilePicture = '../images/default-avatar.png';
    profilePictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                selectedProfilePicture = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Password strength validation
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        let strength = 0;

        // Check length
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Check complexity
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Update password strength meter
        const strengthMeter = document.querySelector('.password-strength-meter');
        strengthMeter.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const bar = document.createElement('div');
            bar.classList.add('strength-bar');
            if (i < strength) bar.classList.add('active');
            strengthMeter.appendChild(bar);
        }

        // Set custom validation
        if (strength < 2) {
            e.target.setCustomValidity('Password is too weak. Use a mix of uppercase, lowercase, numbers, and symbols.');
        } else {
            e.target.setCustomValidity('');
        }
    });

    // Password confirmation validation
    confirmPasswordInput.addEventListener('input', (e) => {
        if (e.target.value !== passwordInput.value) {
            e.target.setCustomValidity('Passwords do not match');
        } else {
            e.target.setCustomValidity('');
        }
    });

    // Form submission handling
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const formData = {
            name: document.getElementById('signupName').value,
            email: document.getElementById('signupEmail').value,
            password: passwordInput.value,
            profilePicture: selectedProfilePicture
        };

        try {
            const result = await AuthService.signup(formData);
            window.location.href = 'user-dashboard.html';
        } catch (error) {
            alert(error.message || 'Signup failed');
        }
    });
});
