document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const phoneInput = document.getElementById('signupPhone');
    const addressInput = document.getElementById('signupAddress');
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

    // Phone number validation
    phoneInput.addEventListener('input', (e) => {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(e.target.value)) {
            e.target.setCustomValidity('Please enter a valid phone number');
        } else {
            e.target.setCustomValidity('');
        }
    });

    // Address validation
    addressInput.addEventListener('input', (e) => {
        const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
        if (e.target.value.length < 10) {
            e.target.setCustomValidity('Please enter a complete address');
        } else {
            e.target.setCustomValidity('');
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
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = {
            name: document.getElementById('signupName').value,
            email: document.getElementById('signupEmail').value,
            phone: phoneInput.value,
            address: addressInput.value,
            workplace: document.getElementById('signupWorkplace').value,
            services: Array.from(document.querySelectorAll('input[name="services"]:checked'))
                .map(checkbox => checkbox.value),
            password: passwordInput.value,
            profilePicture: selectedProfilePicture
        };

        // Simulate form submission (replace with actual backend call)
        console.log('Signup Data:', formData);
        localStorage.setItem('userSignupData', JSON.stringify(formData));
        window.location.href = 'user-dashboard.html';
    });
});
