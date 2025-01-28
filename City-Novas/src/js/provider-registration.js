document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('providerRegistrationForm');
    const responsiveElements = document.querySelectorAll('.responsive-input');

    // Responsive input handling
    responsiveElements.forEach(element => {
        element.addEventListener('focus', (e) => {
            e.target.classList.add('focused');
        });
        element.addEventListener('blur', (e) => {
            e.target.classList.remove('focused');
        });
    });

    // Form validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const errors = validateProviderRegistration(formData);

        if (errors.length === 0) {
            submitProviderRegistration(formData);
        } else {
            displayErrors(errors);
        }
    });

    function validateProviderRegistration(formData) {
        const errors = [];
        const requiredFields = ['name', 'email', 'phone', 'serviceType'];

        requiredFields.forEach(field => {
            if (!formData.get(field) || formData.get(field).trim() === '') {
                errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            }
        });

        return errors;
    }

    function submitProviderRegistration(formData) {
        fetch('/api/provider-registration', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/provider-dashboard.html';
            } else {
                displayErrors([data.message]);
            }
        })
        .catch(error => {
            displayErrors(['Network error. Please try again.']);
        });
    }

    function displayErrors(errors) {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerHTML = errors.map(error => `<p class="error">${error}</p>`).join('');
    }

    // Responsive design adjustments
    function adjustLayoutForScreenSize() {
        const screenWidth = window.innerWidth;
        const container = document.querySelector('.registration-container');

        if (screenWidth < 768) {
            container.classList.add('mobile-view');
        } else {
            container.classList.remove('mobile-view');
        }
    }

    window.addEventListener('resize', adjustLayoutForScreenSize);
    adjustLayoutForScreenSize(); // Initial call
});
