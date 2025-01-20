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

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('#loginEmail').value;
        const password = this.querySelector('#loginPassword').value;
        const remember = this.querySelector('input[name="remember"]').checked;

        // Add your login logic here
        console.log('Login:', { email, password, remember });
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('#registerName').value;
        const email = this.querySelector('#registerEmail').value;
        const password = this.querySelector('#registerPassword').value;
        const confirmPassword = this.querySelector('#confirmPassword').value;
        const terms = this.querySelector('input[name="terms"]').checked;

        // Add your registration logic here
        console.log('Register:', { name, email, password, confirmPassword, terms });
    });
});
