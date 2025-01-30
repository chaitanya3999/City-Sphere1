document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            navButtons.classList.toggle('active');
        });
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Add filter logic here
            const specialty = btn.textContent.toLowerCase();
            filterDoctors(specialty);
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        // Add search logic here
        searchDoctors(searchTerm);
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Load More Button
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Add load more logic here
            loadMoreDoctors();
        });
    }

    // Book Appointment Button
    const consultBtns = document.querySelectorAll('.btn-consult');
    
    consultBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.doctor-card');
            const name = card.querySelector('h3').textContent;
            const fee = card.querySelector('.consultation-fee').textContent;
            bookAppointment(name, fee);
        });
    });

    // Animation Observer
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe doctor cards
    const doctorCards = document.querySelectorAll('.doctor-card');
    doctorCards.forEach(card => {
        observer.observe(card);
    });

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Helper Functions
    function filterDoctors(specialty) {
        const doctors = document.querySelectorAll('.doctor-card');
        
        doctors.forEach(doctor => {
            const doctorSpecialty = doctor.querySelector('.specialty').textContent.toLowerCase();
            
            if (specialty === 'all' || doctorSpecialty === specialty) {
                doctor.style.display = 'block';
            } else {
                doctor.style.display = 'none';
            }
        });
    }

    function searchDoctors(term) {
        const doctors = document.querySelectorAll('.doctor-card');
        
        doctors.forEach(doctor => {
            const name = doctor.querySelector('h3').textContent.toLowerCase();
            const description = doctor.querySelector('.description').textContent.toLowerCase();
            const specialty = doctor.querySelector('.specialty').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term) || specialty.includes(term)) {
                doctor.style.display = 'block';
            } else {
                doctor.style.display = 'none';
            }
        });
    }

    function loadMoreDoctors() {
        // Example: Add 3 more doctor cards
        const doctorsGrid = document.querySelector('.doctors-grid');
        
        // Add loading state
        const loadMoreBtn = document.querySelector('.btn-load-more');
        loadMoreBtn.innerHTML = 'Loading... <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate loading delay
        setTimeout(() => {
            // Add new doctor cards here
            // This is just an example - in a real app, you'd fetch data from a server
            
            // Reset button state
            loadMoreBtn.innerHTML = 'Load More <i class="fas fa-chevron-down"></i>';
        }, 1000);
    }

    function bookAppointment(name, fee) {
        // Add booking logic here
        showMessage(`Appointment request sent for Dr. ${name}!`, 'success');
    }

    function showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Add to document
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});

function redirectToHome() {
    window.location.href = "index.html";
}

function redirectToLogin() {
    window.location.href = "Register-login.html";
    document.getElementById("login-tab");
}
function redirectToSignUp() {
    const signup = document.getElementById("register-tab");
}

// JavaScript for handling dynamic forms for booking appointment and getting prescription

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");

    // Function to create and display the form dynamically
    function displayForm(action, doctorName) {
        const existingForm = document.getElementById("dynamic-form");

        // Remove any existing form before creating a new one
        if (existingForm) {
            existingForm.remove();
        }

        // Create the form container
        const form = document.createElement("form");
        form.id = "dynamic-form";
        form.style.border = "1px solid #ccc";
        form.style.padding = "15px";
        form.style.marginTop = "20px";
        form.style.background = "#f9f9f9";

        // Add heading
        const heading = document.createElement("h3");
        heading.textContent = `${action} for ${doctorName}`;
        form.appendChild(heading);

        // Add input fields
        const nameField = document.createElement("input");
        nameField.type = "text";
        nameField.name = "patientName";
        nameField.placeholder = "Enter your name";
        nameField.required = true;
        nameField.style.margin = "10px 0";
        nameField.style.display = "block";
        form.appendChild(nameField);

        const contactField = document.createElement("input");
        contactField.type = "text";
        contactField.name = "contact";
        contactField.placeholder = "Enter your contact details";
        contactField.required = true;
        contactField.style.margin = "10px 0";
        contactField.style.display = "block";
        form.appendChild(contactField);

        if (action === "Book Appointment") {
            const dateField = document.createElement("input");
            dateField.type = "date";
            dateField.name = "appointmentDate";
            dateField.required = true;
            dateField.style.margin = "10px 0";
            dateField.style.display = "block";
            form.appendChild(dateField);
        }

        // Add submit button
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = `Submit ${action}`;
        submitButton.style.display = "block";
        submitButton.style.marginTop = "10px";
        form.appendChild(submitButton);

        // Append the form to the container
        container.appendChild(form);

        // Scroll to the form 
        form.scrollIntoView({ behavior: "smooth" });

        // Add event listener for form submission
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert(`${action} submitted successfully!`);
            form.remove();
        });
    }

    // Attach event listeners to the buttons
    document.querySelectorAll(".doctor-card .button").forEach((button) => {
        button.addEventListener("click", (event) => {
            const doctorCard = button.closest(".doctor-card");
            const doctorName = doctorCard.querySelector("h2").textContent;

            if (button.textContent.trim() === "Book Appointment") {
                displayForm("Book Appointment", doctorName);
            } else if (button.textContent.trim() === "Get Prescription") {
                displayForm("Get Prescription", doctorName);
            }
        });
    });
});

import walletService from './walletService.js';

// Booking form functionality
const bookingModal = document.getElementById('bookingModal');
const paymentModal = document.getElementById('paymentModal');
const appointmentForm = document.getElementById('appointmentForm');
const closeButtons = document.querySelectorAll('.close');

// Close modals when clicking the close button
closeButtons.forEach(button => {
    button.onclick = function() {
        bookingModal.style.display = "none";
        paymentModal.style.display = "none";
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == bookingModal || event.target == paymentModal) {
        bookingModal.style.display = "none";
        paymentModal.style.display = "none";
    }
}

// Handle book appointment button click
async function handleBookAppointment(doctorCard) {
    const doctorName = doctorCard.querySelector('h3').textContent;
    const feeText = doctorCard.querySelector('.price').textContent;
    const fee = parseInt(feeText.match(/₹(\d+)/)[1]);

    // Set form hidden fields
    document.getElementById('doctorName').value = doctorName;
    document.getElementById('consultationFee').value = fee;
    document.getElementById('modalFee').textContent = fee;

    // Get and display current wallet balance
    const walletBalance = walletService.getBalance();
    document.getElementById('walletBalance').textContent = walletBalance.toFixed(2);

    // Show booking modal
    bookingModal.style.display = "block";
}

// Handle appointment form submission
appointmentForm.onsubmit = async function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(appointmentForm);
    const appointmentData = Object.fromEntries(formData.entries());

    // Validate wallet balance
    const walletBalance = walletService.getBalance();
    const consultationFee = parseInt(appointmentData.consultationFee);

    if (walletBalance < consultationFee) {
        alert('Insufficient wallet balance. Please add money to your wallet.');
        return;
    }

    // Show payment confirmation modal
    document.getElementById('paymentDoctorName').textContent = appointmentData.doctorName;
    document.getElementById('paymentAmount').textContent = appointmentData.consultationFee;
    document.getElementById('paymentDate').textContent = appointmentData.appointmentDate;
    document.getElementById('paymentTime').textContent = appointmentData.appointmentTime;

    bookingModal.style.display = "none";
    paymentModal.style.display = "block";
}

// Handle payment confirmation
document.getElementById('confirmPayment').onclick = async function() {
    const formData = new FormData(appointmentForm);
    const appointmentData = Object.fromEntries(formData.entries());

    try {
        // 1. Process payment from wallet
        const consultationFee = parseInt(appointmentData.consultationFee);
        await walletService.deductMoney(
            consultationFee,
            `Appointment booking with ${appointmentData.doctorName}`
        );

        // 2. Save appointment to localStorage
        const appointment = {
            id: Date.now(),
            doctorName: appointmentData.doctorName,
            patientName: appointmentData.patientName,
            appointmentDate: appointmentData.appointmentDate,
            appointmentTime: appointmentData.appointmentTime,
            symptoms: appointmentData.symptoms,
            medicalHistory: appointmentData.medicalHistory,
            consultationFee: appointmentData.consultationFee,
            status: 'confirmed',
            paymentStatus: 'paid',
            bookingDate: new Date().toISOString()
        };

        // Get existing appointments or initialize empty array
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Show success message with link to appointments
        alert('Appointment booked successfully!');
        if (confirm('Would you like to view your appointments?')) {
            window.location.href = 'my-appointments.html';
        }
        
        // Close modal and reset form
        paymentModal.style.display = "none";
        appointmentForm.reset();

    } catch (error) {
        console.error('Error booking appointment:', error);
        if (error.message === 'Insufficient balance') {
            alert('Insufficient wallet balance. Please add money to your wallet and try again.');
        } else {
            alert('Failed to book appointment. Please try again.');
        }
    }
}

// Attach event listeners to book appointment buttons
document.querySelectorAll('.doctor-card .button').forEach((button, index) => {
    if (button.textContent === 'Book Appointment') {
        button.onclick = function() {
            const doctorCard = button.closest('.doctor-card');
            handleBookAppointment(doctorCard);
        };
    }
});
