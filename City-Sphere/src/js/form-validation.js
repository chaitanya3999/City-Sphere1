// Universal Form Validation Module
class FormValidator {
    constructor(formId, options = {}) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.error(`Form with ID ${formId} not found`);
            return;
        }

        // Default validation rules
        this.defaultRules = {
            required: (value) => value.trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value),
            minLength: (value, length) => value.length >= length,
            maxLength: (value, length) => value.length <= length
        };

        // Merge default options with user-provided options
        this.options = {
            errorClass: 'form-error',
            successClass: 'form-success',
            validateOnBlur: true,
            validateOnSubmit: true,
            ...options
        };

        this.init();
    }

    init() {
        // Add event listeners
        if (this.options.validateOnBlur) {
            this.form.querySelectorAll('input, textarea, select').forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
            });
        }

        if (this.options.validateOnSubmit) {
            this.form.addEventListener('submit', (e) => {
                if (!this.validateForm()) {
                    e.preventDefault();
                }
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const rules = field.dataset.validate ? field.dataset.validate.split('|') : [];
        
        for (let rule of rules) {
            const [ruleName, param] = rule.split(':');
            
            if (!this.defaultRules[ruleName]) {
                console.warn(`Validation rule ${ruleName} not found`);
                continue;
            }

            const isValid = param 
                ? this.defaultRules[ruleName](value, param) 
                : this.defaultRules[ruleName](value);

            if (!isValid) {
                this.markFieldInvalid(field, this.getErrorMessage(ruleName, param));
                return false;
            }
        }

        this.markFieldValid(field);
        return true;
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    markFieldInvalid(field, message) {
        // Remove any existing error messages
        const existingError = field.nextElementSibling;
        if (existingError && existingError.classList.contains(this.options.errorClass)) {
            existingError.remove();
        }

        // Add error styling
        field.classList.remove(this.options.successClass);
        field.classList.add(this.options.errorClass);

        // Create and insert error message
        const errorElement = document.createElement('div');
        errorElement.className = this.options.errorClass;
        errorElement.textContent = message;
        field.insertAdjacentElement('afterend', errorElement);
    }

    markFieldValid(field) {
        // Remove any existing error messages
        const existingError = field.nextElementSibling;
        if (existingError && existingError.classList.contains(this.options.errorClass)) {
            existingError.remove();
        }

        // Add success styling
        field.classList.remove(this.options.errorClass);
        field.classList.add(this.options.successClass);
    }

    getErrorMessage(ruleName, param) {
        const messages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            minLength: `Minimum length is ${param} characters`,
            maxLength: `Maximum length is ${param} characters`
        };

        return messages[ruleName] || 'Invalid input';
    }

    // Static method to initialize validation on multiple forms
    static initMultipleForms(formSelectors, options = {}) {
        return formSelectors.map(selector => 
            new FormValidator(selector, options)
        );
    }
}

// Performance optimization: Lazy load form validation
document.addEventListener('DOMContentLoaded', () => {
    // Example of initializing validation for multiple forms
    FormValidator.initMultipleForms([
        'vegetablesOrderForm', 
        'groceriesOrderForm', 
        'contactForm'
    ], {
        errorClass: 'validation-error',
        validateOnBlur: true,
        validateOnSubmit: true
    });
});
