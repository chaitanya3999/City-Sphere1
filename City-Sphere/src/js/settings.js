import userService from './userService.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!userService.isLoggedIn()) {
        window.location.href = 'auth.html';
        return;
    }

    initializeSettings();
    setupEventListeners();
});

function initializeSettings() {
    // Load user settings from localStorage
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Set form values based on saved settings
    document.getElementById('emailNotifications').checked = settings.emailNotifications ?? true;
    document.getElementById('smsNotifications').checked = settings.smsNotifications ?? true;
    document.getElementById('reminderTime').value = settings.reminderTime || '1';
    document.getElementById('profileVisibility').value = settings.profileVisibility || 'private';
    document.getElementById('activityHistory').checked = settings.activityHistory ?? true;
}

function setupEventListeners() {
    // Account Settings Form
    document.getElementById('accountSettingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const settings = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            smsNotifications: document.getElementById('smsNotifications').checked,
            reminderTime: document.getElementById('reminderTime').value
        };

        saveSettings(settings);
        showSuccessMessage('Account settings updated successfully!');
    });

    // Security Settings Form
    document.getElementById('securitySettingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            showErrorMessage('New passwords do not match!');
            return;
        }

        // In a real app, we would verify the current password and update it on the server
        showSuccessMessage('Password updated successfully!');
        e.target.reset();
    });

    // Privacy Settings Form
    document.getElementById('privacySettingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const settings = {
            profileVisibility: document.getElementById('profileVisibility').value,
            activityHistory: document.getElementById('activityHistory').checked
        };

        saveSettings(settings);
        showSuccessMessage('Privacy settings updated successfully!');
    });

    // Export Data Button
    document.getElementById('exportData').addEventListener('click', exportUserData);

    // Delete Account Button
    document.getElementById('deleteAccount').addEventListener('click', confirmDeleteAccount);
}

function saveSettings(newSettings) {
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
}

function exportUserData() {
    const userData = {
        profile: userService.getCurrentUser(),
        settings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
        appointments: JSON.parse(localStorage.getItem('appointments') || '[]'),
        transactions: JSON.parse(localStorage.getItem('transactions') || '[]')
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-citysphere-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function confirmDeleteAccount() {
    const confirmed = window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmed) {
        // In a real app, we would make an API call to delete the account
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

function showSuccessMessage(message) {
    alert(message); // In a real app, use a proper toast/notification system
}

function showErrorMessage(message) {
    alert(message); // In a real app, use a proper toast/notification system
}
