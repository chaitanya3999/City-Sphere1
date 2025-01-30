import userService from './userService.js';

// DOM Elements
const profileForm = document.getElementById('profileForm');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const activityList = document.getElementById('activityList');

// Initialize profile page
function initializePage() {
    if (!userService.isLoggedIn()) {
        window.location.href = 'auth.html';
        return;
    }

    loadUserData();
    loadRecentActivity();
    setupEventListeners();
}

// Load user data into the form
function loadUserData() {
    const user = userService.getCurrentUser();
    if (!user) return;

    // Update header
    userName.textContent = user.name;
    userEmail.textContent = user.email;

    // Fill form
    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('address').value = user.address || '';
}

// Load recent activity
function loadRecentActivity() {
    // Get appointments
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Get wallet transactions
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Combine and sort activities
    const activities = [
        ...appointments.map(app => ({
            type: 'appointment',
            title: `Appointment with ${app.doctorName}`,
            description: `Status: ${app.status}`,
            date: new Date(app.bookingDate)
        })),
        ...transactions.map(trans => ({
            type: 'transaction',
            title: `Wallet ${trans.type === 'credit' ? 'Credit' : 'Debit'}`,
            description: trans.description,
            date: new Date(trans.date)
        }))
    ];

    // Sort by date (newest first)
    activities.sort((a, b) => b.date - a.date);

    // Display activities
    displayActivities(activities.slice(0, 5)); // Show only last 5 activities
}

// Display activities in the activity list
function displayActivities(activities) {
    activityList.innerHTML = activities.length ? '' : '<p>No recent activity</p>';

    activities.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
            <span class="activity-date">${formatDate(activity.date)}</span>
        `;
        activityList.appendChild(div);
    });
}

// Format date for display
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Setup event listeners
function setupEventListeners() {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        try {
            userService.updateUserData(formData);
            loadUserData(); // Refresh displayed data
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    });
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
