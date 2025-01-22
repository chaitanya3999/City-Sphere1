#!/bin/bash

# Frontend files to update
FRONTEND_DIR="/Users/chaitanya/Documents/GitHub/City-Sphere1/City-Sphere/src/html"
JS_DIR="/Users/chaitanya/Documents/GitHub/City-Sphere1/City-Sphere/src/js"

# Update HTML files to add type="module" to script tags
find "$FRONTEND_DIR" -name "*.html" -type f | while read -r file; do
    # Add type="module" to script tags
    sed -i '' 's/<script src=/<script type="module" src=/g' "$file"
    
    # Ensure custom-auth.js is imported
    if ! grep -q "custom-auth.js" "$file"; then
        # Add import for custom-auth.js near other script imports
        sed -i '' '/<\/body>/i\
    <script type="module" src="../js/custom-auth.js"></script>' "$file"
    fi
    
    echo "Updated authentication scripts in $file"
done

# Update login form in auth.html to use custom authentication
LOGIN_HTML="$FRONTEND_DIR/auth.html"
if [ -f "$LOGIN_HTML" ]; then
    # Modify login form to use custom authentication
    sed -i '' 's/onsubmit="return validateLogin()"/data-login-form/g' "$LOGIN_HTML"
    
    # Add login form handling
    sed -i '' '/<form id="loginForm"/a\
    type="module"' "$LOGIN_HTML"
fi

# Create login form handling script
LOGIN_SCRIPT="$JS_DIR/login-form-handler.js"
cat > "$LOGIN_SCRIPT" << 'EOL'
import AuthService from './custom-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('[data-login-form]');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = loginForm.querySelector('#loginEmail');
            const passwordInput = loginForm.querySelector('#loginPassword');
            const errorElement = loginForm.querySelector('#loginError');
            
            try {
                await AuthService.login(emailInput.value, passwordInput.value);
                window.location.href = 'user-dashboard.html';
            } catch (error) {
                if (errorElement) {
                    errorElement.textContent = error.message || 'Login failed';
                    errorElement.style.display = 'block';
                }
            }
        });
    }
});
EOL

echo "Frontend authentication update complete!"
