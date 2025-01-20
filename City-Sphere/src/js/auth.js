document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked button and corresponding form
            btn.classList.add('active');
            const formId = btn.dataset.tab + 'Form';
            document.getElementById(formId).classList.add('active');
        });
    });

    // Password Toggle
    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Form Submission
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Input validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = this.querySelector('#loginEmail').value;
        const password = this.querySelector('#loginPassword').value;
        const remember = this.querySelector('input[name="remember"]').checked;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(err => err.remove());

        // Validate inputs
        if (!validateEmail(email)) {
            showError(this.querySelector('#loginEmail'), 'Please enter a valid email');
            return;
        }

        try {
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';

            // Add API call here
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            //     },
            //     body: JSON.stringify({ email, password, remember })
            // });

            // Temporary simulation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Redirect on success
            window.location.href = '/home.html';
        } catch (error) {
            showError(this.querySelector('#loginEmail'), 'Login failed. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = this.querySelector('#registerName').value;
        const email = this.querySelector('#registerEmail').value;
        const password = this.querySelector('#registerPassword').value;
        const confirmPassword = this.querySelector('#confirmPassword').value;
        const terms = this.querySelector('input[name="terms"]').checked;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(err => err.remove());

        // Validate inputs
        if (!name.trim()) {
            showError(this.querySelector('#registerName'), 'Name is required');
            return;
        }
        if (!validateEmail(email)) {
            showError(this.querySelector('#registerEmail'), 'Please enter a valid email');
            return;
        }
        if (!validatePassword(password)) {
            showError(this.querySelector('#registerPassword'), 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
            return;
        }
        if (password !== confirmPassword) {
            showError(this.querySelector('#confirmPassword'), 'Passwords do not match');
            return;
        }
        if (!terms) {
            showError(this.querySelector('input[name="terms"]'), 'Please accept the terms and conditions');
            return;
        }

        try {
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';

            // Add API call here
            // const response = await fetch('/api/register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            //     },
            //     body: JSON.stringify({ name, email, password, terms })
            // });

            // Temporary simulation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success and redirect
            alert('Account created successfully! Please log in.');
            window.location.href = '/Register-Login.html#login';
        } catch (error) {
            showError(this.querySelector('#registerEmail'), 'Registration failed. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
