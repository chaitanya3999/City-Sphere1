#!/bin/bash

# Function to update navbar
update_navbar() {
    local file="$1"
    # Remove existing nav-buttons content
    sed -i '' '/<div class="nav-buttons">/,/<\/div>/c\
                <div class="nav-buttons">\
                    <a href="wallet.html" class="btn btn-wallet">\
                        <i class="fas fa-wallet"></i>Wallet\
                    </a>\
                    <a href="auth.html" class="btn btn-login">\
                        <i class="fas fa-user"></i>Login\
                    </a>\
                </div>' "$file"
}

# Find and update all HTML files
find /Users/chaitanya/Documents/GitHub/City-Sphere1/City-Sphere/src/html/ -name "*.html" ! -name "aboutus.html" -print0 | while IFS= read -r -d '' file; do
    update_navbar "$file"
done

echo "Navigation bars updated successfully!"
