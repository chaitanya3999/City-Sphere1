// Sample doctor data
const doctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Cardiologist",
        qualifications: "MD, DM Cardiology",
        experience: 12,
        address: "123 Healthcare Ave, Mumbai",
        waiting_time: "15-20 mins",
        fee: 1500,
        availability: {
            "Monday": ["10:00 AM", "2:00 PM", "4:00 PM"],
            "Tuesday": ["11:00 AM", "3:00 PM", "5:00 PM"],
            "Wednesday": ["9:00 AM", "1:00 PM", "4:00 PM"],
            "Thursday": ["10:00 AM", "2:00 PM", "5:00 PM"],
            "Friday": ["11:00 AM", "3:00 PM", "4:00 PM"]
        }
    },
    {
        id: 2,
        name: "Dr. Rajesh Kumar",
        specialization: "General Physician",
        qualifications: "MBBS, MD",
        experience: 15,
        address: "456 Medical Center, Delhi",
        waiting_time: "10-15 mins",
        fee: 800,
        availability: {
            "Monday": ["9:00 AM", "1:00 PM", "5:00 PM"],
            "Tuesday": ["10:00 AM", "2:00 PM", "4:00 PM"],
            "Wednesday": ["11:00 AM", "3:00 PM", "5:00 PM"],
            "Thursday": ["9:00 AM", "1:00 PM", "4:00 PM"],
            "Friday": ["10:00 AM", "2:00 PM", "5:00 PM"]
        }
    },
    {
        id: 3,
        name: "Dr. Priya Sharma",
        specialization: "Dermatologist",
        qualifications: "MBBS, MD Dermatology",
        experience: 8,
        address: "789 Skin Care Clinic, Bangalore",
        waiting_time: "20-25 mins",
        fee: 1200,
        availability: {
            "Monday": ["11:00 AM", "3:00 PM", "5:00 PM"],
            "Tuesday": ["9:00 AM", "1:00 PM", "4:00 PM"],
            "Wednesday": ["10:00 AM", "2:00 PM", "5:00 PM"],
            "Thursday": ["11:00 AM", "3:00 PM", "4:00 PM"],
            "Friday": ["9:00 AM", "1:00 PM", "5:00 PM"]
        }
    },
    {
        id: 4,
        name: "Dr. Arun Patel",
        specialization: "Pediatrician",
        qualifications: "MBBS, MD Pediatrics",
        experience: 10,
        address: "321 Children's Hospital, Chennai",
        waiting_time: "15-20 mins",
        fee: 1000,
        availability: {
            "Monday": ["10:00 AM", "2:00 PM", "5:00 PM"],
            "Tuesday": ["11:00 AM", "3:00 PM", "4:00 PM"],
            "Wednesday": ["9:00 AM", "1:00 PM", "5:00 PM"],
            "Thursday": ["10:00 AM", "2:00 PM", "4:00 PM"],
            "Friday": ["11:00 AM", "3:00 PM", "5:00 PM"]
        }
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for search and filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchDoctors);
    }

    // Initialize filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const specialty = this.getAttribute('data-specialty') || 'all';
            filterDoctors(specialty);
        });
    });

    // Add event listeners for booking
    document.querySelectorAll('.doctor-card .button').forEach(button => {
        button.addEventListener('click', function() {
            const doctorId = this.getAttribute('data-doctor-id');
            if (doctorId) {
                openBookingModal(parseInt(doctorId));
            }
        });
    });
});

// Search doctors
function searchDoctors() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const doctorCards = document.querySelectorAll('.doctor-card');

    doctorCards.forEach(card => {
        const doctorName = card.querySelector('h3').textContent.toLowerCase();
        const doctorSpecialty = card.querySelector('.doctor-details p').textContent.toLowerCase();
        const doctorLocation = card.querySelector('.doctor-details p:nth-child(5)').textContent.toLowerCase();

        if (doctorName.includes(searchTerm) || 
            doctorSpecialty.includes(searchTerm) || 
            doctorLocation.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter doctors
function filterDoctors(specialty) {
    const doctorCards = document.querySelectorAll('.doctor-card');
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(specialty.toLowerCase())) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    doctorCards.forEach(card => {
        const doctorSpecialty = card.querySelector('.doctor-details p').textContent.toLowerCase();
        if (specialty === 'all' || doctorSpecialty.includes(specialty.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Open booking modal
function openBookingModal(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Book Appointment with ${doctor.name}</h2>
            <form id="appointmentForm">
                <div class="form-group">
                    <label for="appointmentDate">Select Date:</label>
                    <input type="date" id="appointmentDate" required min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="appointmentTime">Select Time:</label>
                    <select id="appointmentTime" required>
                        <option value="">Select a date first</option>
                    </select>
                </div>
                <button type="submit" class="button">
                    <i class="fas fa-calendar-check"></i> Confirm Booking
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Set up close functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    };

    // Handle date selection
    const dateInput = modal.querySelector('#appointmentDate');
    const timeSelect = modal.querySelector('#appointmentTime');
    
    dateInput.addEventListener('change', () => {
        const selectedDate = new Date(dateInput.value);
        const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });
        
        timeSelect.innerHTML = '<option value="">Select a time slot</option>';
        
        if (doctor.availability[dayOfWeek]) {
            doctor.availability[dayOfWeek].forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            });
        }
    });

    // Handle form submission
    const form = modal.querySelector('#appointmentForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = dateInput.value;
        const time = timeSelect.value;
        showBookingConfirmation(doctor, date, time);
        modal.remove();
    });
}

// Show booking confirmation
function showBookingConfirmation(doctor, date, time) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content confirmation-modal">
            <span class="close">&times;</span>
            <div class="confirmation-header">
                <i class="fas fa-check-circle"></i>
                <h2>Appointment Confirmed!</h2>
            </div>
            <div class="confirmation-details">
                <h3>Appointment Details</h3>
                <div class="detail-item">
                    <i class="fas fa-user-md"></i>
                    <div>
                        <strong>Doctor</strong>
                        <p>${doctor.name}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-stethoscope"></i>
                    <div>
                        <strong>Specialization</strong>
                        <p>${doctor.specialization}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <div>
                        <strong>Date</strong>
                        <p>${formattedDate}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <strong>Time</strong>
                        <p>${time}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>Location</strong>
                        <p>${doctor.address}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-rupee-sign"></i>
                    <div>
                        <strong>Consultation Fee</strong>
                        <p>₹${doctor.fee}</p>
                    </div>
                </div>
            </div>
            <div class="confirmation-footer">
                <p class="reminder">
                    <i class="fas fa-bell"></i>
                    A confirmation email will be sent to your registered email address.
                </p>
                <div class="action-buttons">
                    <button class="button" onclick="addToCalendar('${doctor.name}', '${date}', '${time}')">
                        <i class="fas fa-calendar-plus"></i> Add to Calendar
                    </button>
                    <button class="button" onclick="closeConfirmation(this)">
                        <i class="fas fa-check"></i> Done
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Set up close functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    };
}

// Add to calendar functionality
function addToCalendar(doctorName, date, time) {
    const startDate = new Date(`${date} ${time}`);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes appointment

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${doctorName}`)}&dates=${startDate.toISOString().replace(/[-:.]/g, '')}/${endDate.toISOString().replace(/[-:.]/g, '')}`;
    
    window.open(calendarUrl, '_blank');
}

// Close confirmation modal
function closeConfirmation(button) {
    const modal = button.closest('.modal');
    modal.remove();
}
