#!/usr/bin/env python3

import os
import re

# Directory containing HTML files
HTML_DIR = "/Users/chaitanya/Documents/GitHub/City-Sphere1/City-Sphere/src/html"

# Navigation template
NAV_TEMPLATE = '''<header>
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
</header>'''

# Footer template
FOOTER_TEMPLATE = '''<footer>
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
</footer>'''

# Service Worker Registration Script
SW_SCRIPT = '''<script>
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
</script>'''

# Exclude these files from modification
EXCLUDE_FILES = [
    "offline.html"
]

def update_html_file(file_path):
    # Read the file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove existing header, footer, and service worker script
    content = re.sub(r'<header>.*?</header>', '', content, flags=re.DOTALL)
    content = re.sub(r'<footer>.*?</footer>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script>.*?serviceWorker.*?</script>', '', content, flags=re.DOTALL)
    
    # Insert navigation template before <main>
    content = re.sub(r'(<main>)', f'{NAV_TEMPLATE}\n\\1', content)
    
    # Insert footer template before </body>
    content = re.sub(r'(</body>)', f'{FOOTER_TEMPLATE}\n\\1', content)
    
    # Insert service worker script before </body>
    content = re.sub(r'(</body>)', f'{SW_SCRIPT}\n\\1', content)
    
    # Write back to the file
    with open(file_path, 'w') as f:
        f.write(content)

def main():
    # Process each HTML file
    for filename in os.listdir(HTML_DIR):
        if filename.endswith('.html'):
            # Skip excluded files
            if filename in EXCLUDE_FILES:
                print(f"Skipping {filename}")
                continue
            
            file_path = os.path.join(HTML_DIR, filename)
            print(f"Processing {filename}")
            update_html_file(file_path)
    
    print("HTML template update complete!")

if __name__ == "__main__":
    main()
