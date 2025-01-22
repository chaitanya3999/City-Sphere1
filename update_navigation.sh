#!/bin/bash

# Directory containing HTML files
HTML_DIR="/Users/chaitanya/Documents/GitHub/City-Sphere1/City-Sphere/src/html"

# Backup original files
mkdir -p "$HTML_DIR/backup"
cp "$HTML_DIR"/*.html "$HTML_DIR/backup/"

# Function to update navigation section
update_navigation() {
    local file="$1"
    
    # Use sed to modify the navigation buttons section
    sed -i '' '/<div class="nav-buttons">/,/<\/div>/c\
            <div class="nav-buttons">\
              <a href="wallet.html" class="btn btn-wallet">\
                <i class="fas fa-wallet"></i>Wallet\
              </a>\
              <div id="authSection">\
                <a href="auth.html" class="btn btn-login">\
                  <i class="fas fa-user"></i>Login\
                </a>\
              </div>\
            </div>' "$file"
}

# Add script tag before closing body tag
add_script() {
    local file="$1"
    
    # Check if script is already added
    if ! grep -q "home.js" "$file"; then
        sed -i '' '/<\/body>/i\
    <script src="../js/home.js"></script>' "$file"
    fi
}

# Process all HTML files
for file in "$HTML_DIR"/*.html; do
    # Skip files that might cause issues
    if [[ "$file" == *"auth.html" || "$file" == *"offline.html" ]]; then
        continue
    fi
    
    update_navigation "$file"
    add_script "$file"
    
    echo "Updated: $file"
done

echo "Navigation update complete!"
