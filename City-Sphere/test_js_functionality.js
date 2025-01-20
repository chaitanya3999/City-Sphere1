// Comprehensive JavaScript Functionality Test

document.addEventListener('DOMContentLoaded', () => {
    const testResults = {
        formSubmissions: [],
        buttonClicks: [],
        navigationTests: [],
        errorTests: []
    };

    // Test Form Submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual submission
            const formData = new FormData(form);
            const formEntries = Object.fromEntries(formData.entries());
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            const missingFields = Array.from(requiredFields)
                .filter(field => !field.value.trim());
            
            testResults.formSubmissions.push({
                formId: form.id || 'unnamed-form',
                formData: formEntries,
                missingFields: missingFields.map(f => f.name)
            });
        });
    });

    // Test Button Clicks
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            testResults.buttonClicks.push({
                buttonText: button.textContent.trim(),
                buttonId: button.id || 'unnamed-button',
                clickTimestamp: new Date().toISOString()
            });
        });
    });

    // Test Navigation Links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            testResults.navigationTests.push({
                href: link.href,
                text: link.textContent.trim(),
                clickTimestamp: new Date().toISOString()
            });
        });
    });

    // Error Handling Test
    window.addEventListener('error', (event) => {
        testResults.errorTests.push({
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            timestamp: new Date().toISOString()
        });
    });

    // Logging Test Results
    window.logTestResults = () => {
        console.group('Comprehensive Site Functionality Test');
        console.log('Form Submissions:', testResults.formSubmissions);
        console.log('Button Clicks:', testResults.buttonClicks);
        console.log('Navigation Tests:', testResults.navigationTests);
        console.log('Error Tests:', testResults.errorTests);
        console.groupEnd();
        return testResults;
    };

    // Trigger logging after a short delay
    setTimeout(() => {
        window.logTestResults();
    }, 2000);
});
