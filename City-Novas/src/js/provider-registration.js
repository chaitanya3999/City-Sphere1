document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('provider-registration-form');
    const formSteps = form.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-indicator .step');
    const nextButtons = form.querySelectorAll('.next-btn');
    const prevButtons = form.querySelectorAll('.prev-btn');

    // OTP Verification Elements
    const sendOtpBtn = document.querySelector('.btn-send-otp');
    const verifyOtpBtn = document.querySelector('.btn-verify-otp');
    const otpSection = document.querySelector('.otp-section');
    const otpVerificationSection = document.querySelector('.otp-verification');
    const otpInput = document.getElementById('otp');
    const phoneInput = document.getElementById('phone-verification');
    const otpCountdown = document.getElementById('otp-countdown');
    const submitBtn = document.querySelector('.submit-btn');

    let currentStep = 0;

    // Validation function
    function validateStep(step) {
        const inputs = step.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            // Remove previous error states
            input.classList.remove('error');
            
            // Check required fields
            if (input.hasAttribute('required')) {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                }
            }

            // Specific validations
            switch(input.id) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        input.classList.add('error');
                        isValid = false;
                    }
                    break;
                case 'phone':
                    const phoneRegex = /^[0-9]{10}$/;
                    if (!phoneRegex.test(input.value)) {
                        input.classList.add('error');
                        isValid = false;
                    }
                    break;
            }
        });

        return isValid;
    }

    // Update progress indicator
    function updateProgressIndicator(stepIndex) {
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= stepIndex);
        });
    }

    // Next button handler
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStepElement = formSteps[currentStep];
            
            if (validateStep(currentStepElement)) {
                currentStepElement.classList.remove('active');
                currentStep++;
                formSteps[currentStep].classList.add('active');
                updateProgressIndicator(currentStep);
            } else {
                // Highlight errors
                const errorInputs = currentStepElement.querySelectorAll('.error');
                errorInputs[0].focus();
            }
        });
    });

    // Previous button handler
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            formSteps[currentStep].classList.remove('active');
            currentStep--;
            formSteps[currentStep].classList.add('active');
            updateProgressIndicator(currentStep);
        });
    });

    // OTP Verification Logic
    let otpTimer;
    let generatedOTP = '';

    sendOtpBtn.addEventListener('click', () => {
        const phoneNumber = phoneInput.value.trim();
        
        if (!phoneNumber || phoneNumber.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        // Simulate OTP generation (replace with actual backend OTP generation)
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated OTP:', generatedOTP); // For demonstration

        // Show OTP verification section
        otpSection.style.display = 'none';
        otpVerificationSection.style.display = 'block';

        // Start countdown
        let timeLeft = 60;
        otpCountdown.textContent = timeLeft;

        otpTimer = setInterval(() => {
            timeLeft--;
            otpCountdown.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(otpTimer);
                generatedOTP = ''; // Clear OTP after timeout
                alert('OTP has expired. Please request a new one.');
            }
        }, 1000);
    });

    verifyOtpBtn.addEventListener('click', () => {
        const enteredOTP = otpInput.value.trim();

        if (enteredOTP === generatedOTP) {
            // OTP Verified Successfully
            clearInterval(otpTimer);
            submitBtn.disabled = false;
            alert('Phone number verified successfully!');
            otpVerificationSection.classList.add('verified');
        } else {
            alert('Incorrect OTP. Please try again.');
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Final validation
        const isValid = Array.from(formSteps).every(validateStep);
        
        if (isValid) {
            if (submitBtn.disabled) {
                alert('Please verify your phone number first.');
                return;
            }

            const formData = new FormData(form);
            
            try {
                // Simulate API call
                const response = await fetch('/api/register-provider', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful!',
                        text: `Your Provider ID: ${result.providerId}`,
                        confirmButtonText: 'Go to Dashboard'
                    }).then(() => {
                        window.location.href = '/provider-dashboard.html';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Failed',
                        text: 'Please check your information and try again.'
                    });
                }
            } catch (error) {
                console.error('Registration error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try again later.'
                });
            }
        }
    });

    // Add error styling to inputs
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.classList.add('error');
        });

        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
});
