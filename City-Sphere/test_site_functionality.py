import os
import re
from bs4 import BeautifulSoup
import requests

class SiteValidator:
    def __init__(self, base_path):
        self.base_path = base_path
        self.html_files = []
        self.errors = []
        self.warnings = []

    def find_html_files(self):
        """Find all HTML files in the project"""
        for root, dirs, files in os.walk(self.base_path):
            for file in files:
                if file.endswith('.html'):
                    self.html_files.append(os.path.join(root, file))
        return self.html_files

    def validate_links(self):
        """Check all links in HTML files"""
        for html_file in self.html_files:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Check href links
                links = soup.find_all(['a', 'link'])
                for link in links:
                    href = link.get('href')
                    if href and href.startswith(('http', 'https', 'mailto', '#')):
                        continue
                    
                    # Validate internal links
                    if href:
                        full_path = os.path.normpath(os.path.join(os.path.dirname(html_file), href))
                        if not os.path.exists(full_path):
                            self.errors.append(f"Broken link in {html_file}: {href}")

    def validate_forms(self):
        """Check form attributes and inputs"""
        for html_file in self.html_files:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                soup = BeautifulSoup(content, 'html.parser')
                
                forms = soup.find_all('form')
                for form in forms:
                    # Check form has method
                    if not form.get('method'):
                        self.warnings.append(f"Form in {html_file} missing method attribute")
                    
                    # Check form has action
                    if not form.get('action'):
                        self.warnings.append(f"Form in {html_file} missing action attribute")
                    
                    # Check required inputs
                    required_inputs = form.find_all('input[required]')
                    if not required_inputs:
                        self.warnings.append(f"Form in {html_file} has no required inputs")

    def validate_buttons(self):
        """Check button functionality"""
        for html_file in self.html_files:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                soup = BeautifulSoup(content, 'html.parser')
                
                buttons = soup.find_all('button')
                for button in buttons:
                    # Check button type
                    if not button.get('type'):
                        self.warnings.append(f"Button in {html_file} missing type attribute")
                    
                    # Check button has meaningful text or aria-label
                    if not button.text.strip() and not button.get('aria-label'):
                        self.warnings.append(f"Button in {html_file} has no text or aria-label")

    def validate_service_worker(self):
        """Check service worker registration"""
        sw_path = os.path.join(self.base_path, 'service-worker.js')
        if not os.path.exists(sw_path):
            self.errors.append("Service worker file missing")

    def validate_manifest(self):
        """Check web app manifest"""
        manifest_path = os.path.join(self.base_path, 'src', 'manifest.json')
        if not os.path.exists(manifest_path):
            self.errors.append("Web app manifest file missing")

    def run_validation(self):
        """Run all validation checks"""
        self.find_html_files()
        self.validate_links()
        self.validate_forms()
        self.validate_buttons()
        self.validate_service_worker()
        self.validate_manifest()

        # Print results
        print("\n--- VALIDATION REPORT ---")
        
        if self.errors:
            print("\nERRORS:")
            for error in self.errors:
                print(f"❌ {error}")
        else:
            print("\n✅ No critical errors found!")
        
        if self.warnings:
            print("\nWARNINGS:")
            for warning in self.warnings:
                print(f"⚠️ {warning}")
        else:
            print("\n✅ No warnings found!")

        return len(self.errors) == 0

# Run validation
validator = SiteValidator('/Users/chaitanya/Documents/GitHub/City-Sphere1/City-Sphere')
validator.run_validation()
