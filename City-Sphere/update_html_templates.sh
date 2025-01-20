#!/bin/bash

# Directory containing HTML files
HTML_DIR="/Users/chaitanya/Documents/GitHub/City-Sphere1/City-Sphere/src/html"

# Temporary file for processing
TEMP_FILE=$(mktemp)

# Navigation template
read -r -d '' NAV_TEMPLATE << EOM
<header>
    <div class="top-header">
        <div class="container">
            <div class="logo-container">
                <div class="logo-circle">
                    <img src="../images/City Sphere Final copy.png" alt="City Sphere Logo" class="logo-image" />
                </div>
                <div class="logo-text">
                    <h1>City Sphere</h1>
                    <p class="tagline">My City in My Phone</p>
                </div>
            </div>
        </div>
    </div>
    <nav class="navbar">
        <div class="container">
            <div class="nav-wrapper">
                <ul class="nav-links">
                    <li><a href="index.html"><i class="fas fa-home"></i>Home</a></li>
                    <li><a href="services.html"><i class="fas fa-cogs"></i>Services</a></li>
                    <li><a href="aboutus.html"><i class="fas fa-users"></i>About Us</a></li>
                    <li><a href="contact.html"><i class="fas fa-envelope"></i>Contact</a></li>
                </ul>
                <div class="nav-buttons">
                    <a href="wallet.html" class="btn btn-wallet">
                        <i class="fas fa-wallet"></i>Wallet
                    </a>
                    <a href="Register-Login.html" class="btn btn-login">
                        <i class="fas fa-user"></i>Login
                    </a>
                    <a href="Register-Login.html" class="btn btn-signup">
                        Sign Up<i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
</header>
EOM

# Footer template
read -r -d '' FOOTER_TEMPLATE << EOM
<footer>
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>About City Sphere</h3>
                <p>Connecting citizens, simplifying urban life.</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact Us</h3>
                <p>Email: info@citysphere.com</p>
                <p>Phone: +1 234 567 890</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 City Sphere. All Rights Reserved.</p>
        </div>
    </div>
</footer>
EOM

# Service Worker Registration Script
read -r -d '' SW_SCRIPT << EOM
<script>
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("../service-worker.js")
                .then((registration) => {
                    console.log(
                        "Service Worker registered successfully:",
                        registration.scope
                    );
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        });
    }
</script>
EOM

# Exclude these files from modification
EXCLUDE_FILES=(
    "offline.html"
)

# Process each HTML file
for file in "$HTML_DIR"/*.html; do
    filename=$(basename "$file")
    
    # Skip excluded files
    skip=0
    for excluded in "${EXCLUDE_FILES[@]}"; do
        if [[ "$filename" == "$excluded" ]]; then
            skip=1
            break
        fi
    done
    
    if [[ $skip -eq 1 ]]; then
        echo "Skipping $filename"
        continue
    fi

    echo "Processing $filename"
    
    # Create a temporary file
    cp "$file" "$TEMP_FILE"
    
    # Remove existing header and footer
    sed -i '' '/<header>/,/<\/header>/d' "$TEMP_FILE"
    sed -i '' '/<footer>/,/<\/footer>/d' "$TEMP_FILE"
    
    # Remove existing service worker script
    sed -i '' '/<script>.*serviceWorker.*<\/script>/d' "$TEMP_FILE"
    
    # Insert navigation template before <main>
    sed -i '' "/<main>/i\\
$NAV_TEMPLATE" "$TEMP_FILE"
    
    # Insert footer template before </body>
    sed -i '' "/<\/body>/i\\
$FOOTER_TEMPLATE" "$TEMP_FILE"
    
    # Insert service worker script before </body>
    sed -i '' "/<\/body>/i\\
$SW_SCRIPT" "$TEMP_FILE"
    
    # Overwrite original file
    mv "$TEMP_FILE" "$file"
done

# Clean up
rm -f "$TEMP_FILE"

echo "HTML template update complete!"
