document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('provider-registration-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-indicator .step');
    let currentStep = 0;

    class ProviderRegistrationValidator {
        constructor(form) {
            this.form = form;
            this.validationRules = {
                'full-name': { required: true, minLength: 3 },
                'email': { required: true, email: true },
                'phone': { required: true, phone: true },
                'business-name': { required: true, minLength: 2 },
                'service-category': { required: true },
                'business-address': { required: true, minLength: 10 },
                'terms-agreement': { required: true }
            };
        }

        validateField(field) {
            const value = field.value.trim();
            const rules = this.validationRules[field.id];
            if (!rules) return true;

            const errors = [];

            if (rules.required && !value) {
                errors.push('This field is required');
            }

            if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push('Please enter a valid email address');
            }

            if (rules.phone && value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
                errors.push('Please enter a valid phone number');
            }

            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`Minimum length is ${rules.minLength} characters`);
            }

            this.showFieldValidation(field, errors);
            return errors.length === 0;
        }

        showFieldValidation(field, errors) {
            const container = field.parentElement;
            const existingError = container.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            field.classList.remove('invalid', 'valid');
            if (errors.length > 0) {
                field.classList.add('invalid');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = errors[0];
                container.appendChild(errorDiv);
            } else {
                field.classList.add('valid');
            }
        }

        validateStep(stepIndex) {
            const stepFields = steps[stepIndex].querySelectorAll('input, select');
            let isValid = true;

            stepFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }
    }

    const validator = new ProviderRegistrationValidator(form);

    // Add input validation on blur
    form.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('blur', () => {
            validator.validateField(field);
        });
    });

    // Navigation buttons functionality
    form.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (validator.validateStep(currentStep)) {
                steps[currentStep].classList.remove('active');
                progressSteps[currentStep].classList.add('completed');
                currentStep++;
                steps[currentStep].classList.add('active');
                progressSteps[currentStep].classList.add('active');
            }
        });
    });

    form.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            steps[currentStep].classList.remove('active');
            progressSteps[currentStep].classList.remove('active');
            currentStep--;
            steps[currentStep].classList.add('active');
        });
    });

    // OTP functionality
    const sendOtpBtn = document.querySelector('.btn-send-otp');
    const verifyOtpBtn = document.querySelector('.btn-verify-otp');
    const otpVerification = document.querySelector('.otp-verification');
    const submitBtn = document.querySelector('.submit-btn');

    sendOtpBtn?.addEventListener('click', async () => {
        const phoneInput = document.getElementById('phone-verification');
        if (validator.validateField(phoneInput)) {
            try {
                // Simulate OTP sending
                otpVerification.style.display = 'block';
                startOtpTimer();
            } catch (error) {
                console.error('Failed to send OTP:', error);
            }
        }
    });

    function startOtpTimer() {
        let timeLeft = 60;
        const timerSpan = document.getElementById('otp-countdown');
        const timer = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                sendOtpBtn.disabled = false;
            }
        }, 1000);
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validator.validateStep(currentStep)) {
            try {
                const formData = new FormData(form);
                const response = await fetch('/api/provider/register', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    window.location.href = 'provider-dashboard.html';
                } else {
                    const error = await response.json();
                    throw new Error(error.message);
                }
            } catch (error) {
                console.error('Registration failed:', error);
            }
        }
    });
});
