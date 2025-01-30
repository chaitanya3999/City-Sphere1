// DOM Elements
const appointmentsList = document.getElementById('appointmentsList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize page
function initializePage() {
    loadAppointments();
    setupEventListeners();
}

// Load appointments from localStorage
function loadAppointments(filter = 'all') {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    if (appointments.length === 0) {
        showNoAppointments();
        return;
    }

    // Sort appointments by date (newest first)
    appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

    // Filter appointments
    const filteredAppointments = filterAppointments(appointments, filter);
    
    if (filteredAppointments.length === 0) {
        showNoAppointmentsForFilter(filter);
        return;
    }

    // Display appointments
    displayAppointments(filteredAppointments);
}

// Filter appointments based on date
function filterAppointments(appointments, filter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
        case 'upcoming':
            return appointments.filter(app => new Date(app.appointmentDate) >= today);
        case 'past':
            return appointments.filter(app => new Date(app.appointmentDate) < today);
        default:
            return appointments;
    }
}

// Display appointments in the list
function displayAppointments(appointments) {
    appointmentsList.innerHTML = '';
    
    appointments.forEach(appointment => {
        const appointmentElement = createAppointmentElement(appointment);
        appointmentsList.appendChild(appointmentElement);
    });
}

// Create appointment card element
function createAppointmentElement(appointment) {
    const appointmentDate = new Date(appointment.appointmentDate);
    const isUpcoming = appointmentDate >= new Date();
    
    const div = document.createElement('div');
    div.className = 'appointment-card';
    div.innerHTML = `
        <div class="appointment-header">
            <div class="doctor-info">
                <h3>${appointment.doctorName}</h3>
            </div>
            <span class="appointment-status status-${appointment.status.toLowerCase()}">
                ${appointment.status}
            </span>
        </div>
        <div class="appointment-details">
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(appointment.appointmentDate)}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>${appointment.appointmentTime}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-money-bill"></i>
                <span>₹${appointment.consultationFee}</span>
            </div>
        </div>
        <div class="appointment-info">
            <div class="detail-item">
                <i class="fas fa-notes-medical"></i>
                <span><strong>Symptoms:</strong> ${appointment.symptoms}</span>
            </div>
            ${appointment.medicalHistory ? `
                <div class="detail-item">
                    <i class="fas fa-file-medical"></i>
                    <span><strong>Medical History:</strong> ${appointment.medicalHistory}</span>
                </div>
            ` : ''}
        </div>
        ${isUpcoming ? `
            <div class="appointment-actions">
                <button class="action-btn btn-reschedule" onclick="rescheduleAppointment('${appointment.id}')">
                    Reschedule
                </button>
                <button class="action-btn btn-cancel" onclick="cancelAppointment('${appointment.id}')">
                    Cancel
                </button>
            </div>
        ` : ''}
    `;
    
    return div;
}

// Show message when no appointments are found
function showNoAppointments() {
    appointmentsList.innerHTML = `
        <div class="no-appointments">
            <i class="fas fa-calendar-times fa-3x"></i>
            <h3>No Appointments Found</h3>
            <p>You haven't booked any appointments yet.</p>
            <a href="doctors.html" class="action-btn btn-reschedule">Book an Appointment</a>
        </div>
    `;
}

// Show message when no appointments match the filter
function showNoAppointmentsForFilter(filter) {
    appointmentsList.innerHTML = `
        <div class="no-appointments">
            <i class="fas fa-calendar-times fa-3x"></i>
            <h3>No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments</h3>
            <p>You don't have any ${filter} appointments.</p>
        </div>
    `;
}

// Format date for display
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Setup event listeners
function setupEventListeners() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Load filtered appointments
            loadAppointments(button.dataset.filter);
        });
    });
}

import walletService from './walletService.js';

// Reschedule appointment
window.rescheduleAppointment = function(appointmentId) {
    alert('Reschedule functionality will be implemented soon!');
};

// Cancel appointment
window.cancelAppointment = async function(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment? The consultation fee will be refunded to your wallet.')) {
        try {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const appointmentIndex = appointments.findIndex(app => app.id.toString() === appointmentId);
            
            if (appointmentIndex !== -1) {
                const appointment = appointments[appointmentIndex];
                const refundAmount = parseInt(appointment.consultationFee);

                // Process refund
                await walletService.refundMoney(
                    refundAmount,
                    `Refund for cancelled appointment with ${appointment.doctorName}`
                );

                // Update appointment status
                appointments[appointmentIndex].status = 'Cancelled';
                appointments[appointmentIndex].cancellationDate = new Date().toISOString();
                localStorage.setItem('appointments', JSON.stringify(appointments));

                // Reload appointments list
                loadAppointments(document.querySelector('.filter-btn.active').dataset.filter);

                // Show success message
                alert(`Appointment cancelled successfully. ₹${refundAmount} has been refunded to your wallet.`);
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            alert('Failed to cancel appointment. Please try again.');
        }
    }
};

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
