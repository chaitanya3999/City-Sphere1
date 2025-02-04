import apiService from './services/api.service.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    initializeDashboard();
    setupEventListeners();
});

async function checkAuthentication() {
    try {
        const isAuthenticated = await apiService.checkAuth();
        if (!isAuthenticated) {
            window.location.replace('/src/html/auth.html');
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.replace('/src/html/auth.html');
    }
}

async function initializeDashboard() {
    try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Update user info
        const userName = document.getElementById('userName');
        const sidebarUserName = document.getElementById('sidebarUserName');
        const userEmail = document.getElementById('userEmail');
        
        if (userData) {
            userName.textContent = userData.name || 'User';
            sidebarUserName.textContent = userData.name || 'User';
            userEmail.textContent = userData.email || 'user@email.com';

            // Fill profile form if exists
            const fullNameInput = document.getElementById('fullName');
            const phoneNumberInput = document.getElementById('phoneNumber');
            const addressInput = document.getElementById('address');

            if (fullNameInput) fullNameInput.value = userData.name || '';
            if (phoneNumberInput) phoneNumberInput.value = userData.phone || '';
            if (addressInput) addressInput.value = userData.address || '';
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

function setupEventListeners() {
    // Handle section navigation
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Update active state
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
        });
    });

    // Handle profile form submission
    const profileForm = document.getElementById('profileCompletionForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const formData = {
                    name: document.getElementById('fullName').value,
                    phone: document.getElementById('phoneNumber').value,
                    address: document.getElementById('address').value
                };

                const response = await apiService.request('/users/profile', {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });

                if (response.success) {
                    alert('Profile updated successfully!');
                    initializeDashboard(); // Refresh dashboard data
                } else {
                    throw new Error(response.message || 'Failed to update profile');
                }
            } catch (error) {
                console.error('Profile update failed:', error);
                alert(error.message || 'Failed to update profile. Please try again.');
            }
        });
    }
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-content section').forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
}

// Check authentication status periodically
setInterval(checkAuthentication, 300000); // Check every 5 minutes