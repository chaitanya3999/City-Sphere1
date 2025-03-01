import apiService from './services/api.service.js';
import appointmentService from './services/appointment.service.js';

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
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hide');

        // Get user data from localStorage and validate
        let userData;
        try {
            userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (!userData || typeof userData !== 'object') {
                throw new Error('Invalid user data format');
            }
        } catch (e) {
            console.error('Failed to parse user data:', e);
            userData = {};
        }
        
        // Update user info with proper null checks
        const elements = {
            userName: document.getElementById('userName'),
            sidebarUserName: document.getElementById('sidebarUserName'),
            userEmail: document.getElementById('userEmail'),
            fullNameInput: document.getElementById('fullName'),
            phoneNumberInput: document.getElementById('phoneNumber'),
            addressInput: document.getElementById('address')
        };

        // Validate all required elements exist
        Object.entries(elements).forEach(([key, element]) => {
            if (key.includes('Input')) return; // Skip optional form inputs
            if (!element) {
                throw new Error(`Required element ${key} not found in the DOM`);
            }
        });

        // Update display elements
        elements.userName.textContent = userData.name || 'User';
        elements.sidebarUserName.textContent = userData.name || 'User';
        elements.userEmail.textContent = userData.email || 'user@email.com';

        // Update form inputs if they exist
        if (elements.fullNameInput) elements.fullNameInput.value = userData.name || '';
        if (elements.phoneNumberInput) elements.phoneNumberInput.value = userData.phone || '';
        if (elements.addressInput) elements.addressInput.value = userData.address || '';

        // Load and display appointments
        loadDashboardAppointments();
        updateActivitySummary();
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

// Load and display upcoming appointments
async function loadDashboardAppointments() {
    const upcomingAppointmentsElement = document.getElementById('upcomingAppointments');
    if (!upcomingAppointmentsElement) {
        console.error('Appointments container not found');
        return;
    }

    // Show loading state
    upcomingAppointmentsElement.innerHTML = `
        <div class="loading-appointments">
            <div class="spinner"></div>
            <p>Loading your appointments...</p>
        </div>
    `;

    try {
        // Fetch latest appointments from server
        const appointments = await appointmentService.getAppointments();
        if (!Array.isArray(appointments)) {
            throw new Error('Invalid appointments data received');
        }

        // Filter upcoming appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingAppointments = appointments
            .filter(app => {
                try {
                    return new Date(app.appointmentDate) >= today;
                } catch (e) {
                    console.error('Invalid date format:', app.appointmentDate);
                    return false;
                }
            })
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
            .slice(0, 3); // Show only next 3 appointments

        if (upcomingAppointments.length === 0) {
            upcomingAppointmentsElement.innerHTML = `
                <div class="no-appointments">
                    <p>No upcoming appointments</p>
                    <a href="doctors.html" class="action-btn">Book an Appointment</a>
                </div>
            `;
            return;
        }

        upcomingAppointmentsElement.innerHTML = upcomingAppointments
            .map(appointment => {
                // Validate required fields
                const doctorName = appointment.doctorName || 'Unknown Doctor';
                const appointmentDate = appointment.appointmentDate ? formatDate(appointment.appointmentDate) : 'Date not set';
                const appointmentTime = appointment.appointmentTime || 'Time not set';
                const status = appointment.status ? appointment.status.toLowerCase() : 'pending';

                return `
                    <div class="appointment-item">
                        <div class="appointment-info">
                            <h4>${doctorName}</h4>
                            <p><i class="fas fa-calendar"></i> ${appointmentDate}</p>
                            <p><i class="fas fa-clock"></i> ${appointmentTime}</p>
                        </div>
                        <span class="appointment-status status-${status}">
                            ${status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </div>
                `;
            })
            .join('');
    } catch (error) {
        console.error('Failed to load appointments:', error);
        upcomingAppointmentsElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load appointments. Please try again later.</p>
                <button onclick="loadDashboardAppointments()" class="retry-btn">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// Update activity summary
function updateActivitySummary() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Update total appointments
    document.getElementById('totalAppointments').textContent = appointments.length;
    
    // Update total transactions if the element exists
    const totalTransactionsElement = document.getElementById('totalTransactions');
    if (totalTransactionsElement) {
        totalTransactionsElement.textContent = transactions.length;
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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