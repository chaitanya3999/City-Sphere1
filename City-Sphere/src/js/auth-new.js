document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const passwordToggles = document.querySelectorAll('.password-toggle');

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));

            // Add active class to clicked button and corresponding form
            btn.classList.add('active');
            const formId = btn.dataset.form === 'login' ? 'loginForm' : 'signupForm';
            document.getElementById(formId).classList.add('active');
        });
    });

    // Password Toggle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            const icon = toggle.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // Validation Utilities
    function showError(input, message) {
        const errorContainer = input.parentElement;
        const existingError = errorContainer.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }

        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        
        input.classList.add('input-error');
        errorContainer.appendChild(errorElement);
    }

    function clearErrors(form) {
        form.querySelectorAll('.input-error, .error-message').forEach(el => {
            el.classList.remove('input-error');
            if (el.classList.contains('error-message')) {
                el.remove();
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        const strengthMeter = document.querySelector('.password-strength-meter');
        
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        strengthMeter.innerHTML = `<div class="${
            strength <= 2 ? 'weak' : 
            strength <= 4 ? 'medium' : 
            'strong'}" style="width: ${strength * 20}%"></div>`;

        return strength;
    }

    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors(loginForm);

        const emailInput = loginForm.querySelector('#loginEmail');
        const passwordInput = loginForm.querySelector('#loginPassword');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let isValid = true;

        if (!email) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Invalid email format');
            isValid = false;
        }

        if (!password) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        }

        if (isValid) {
            try {
                // Here you would typically make an API call to authenticate
                console.log('Login attempt:', email);
                // Redirect or show success message
                window.location.href = 'index.html';
            } catch (error) {
                showError(passwordInput, 'Login failed. Please try again.');
            }
        }
    });

    // Signup Form Validation
    const signupForm = document.getElementById('signupForm');
    const signupPasswordInput = signupForm.querySelector('#signupPassword');
    const confirmPasswordInput = signupForm.querySelector('#confirmPassword');

    signupPasswordInput.addEventListener('input', () => {
        calculatePasswordStrength(signupPasswordInput.value);
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors(signupForm);

        const nameInput = signupForm.querySelector('#signupName');
        const emailInput = signupForm.querySelector('#signupEmail');
        const termsCheckbox = signupForm.querySelector('#termsCheckbox');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = signupPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        let isValid = true;

        if (!name) {
            showError(nameInput, 'Name is required');
            isValid = false;
        }

        if (!email) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Invalid email format');
            isValid = false;
        }

        if (!password) {
            showError(signupPasswordInput, 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showError(signupPasswordInput, 'Password must be at least 8 characters');
            isValid = false;
        }

        if (!confirmPassword) {
            showError(confirmPasswordInput, 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        }

        if (!termsCheckbox.checked) {
            showError(termsCheckbox, 'Please accept the terms and conditions');
            isValid = false;
        }

        if (isValid) {
            // Simulated signup logic
            console.log('Signup attempt:', email, name);
            // Replace with actual registration logic
            window.location.href = 'index.html';
        }
    });
});
