document.addEventListener('DOMContentLoaded', () => {
  const userDetailsForm = document.getElementById('userDetailsForm');
  const phoneInput = document.getElementById('userPhone');
  const addressInput = document.getElementById('userAddress');
  const workplaceInput = document.getElementById('userWorkplace');

  // Phone number validation
  phoneInput.addEventListener('input', () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneInput.value)) {
      phoneInput.setCustomValidity('Please enter a valid 10-digit phone number');
    } else {
      phoneInput.setCustomValidity('');
    }
  });

  // Form submission handler
  userDetailsForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect form data
    const formData = {
      phone: phoneInput.value || null,
      address: addressInput.value || null,
      workplace: workplaceInput.value || null,
      services: Array.from(
        document.querySelectorAll('input[name="services"]:checked')
      ).map(checkbox => checkbox.value)
    };

    try {
      const response = await fetch('/api/user/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Show success message
        alert('User details updated successfully!');
        
        // Optional: Update UI to reflect new details
        updateUserProfileUI(formData);
      } else {
        // Handle error
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to update details'}`);
      }
    } catch (error) {
      console.error('Error submitting user details:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  });

  // Function to update UI with new user details
  function updateUserProfileUI(details) {
    // Update profile sections or display user details
    const profileSections = document.querySelectorAll('.profile-section');
    profileSections.forEach(section => {
      if (details.phone) section.querySelector('.phone-display').textContent = details.phone;
      if (details.address) section.querySelector('.address-display').textContent = details.address;
      // Add more UI updates as needed
    });
  }
});
