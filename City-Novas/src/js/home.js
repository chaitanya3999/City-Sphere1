// Dynamic Greeting
function updateGreeting() {
  const greetingEl = document.getElementById('greeting');
  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  
  if (greetingEl) {
    const hour = new Date().getHours();
    let greeting = 'Good ';
    
    if (hour < 12) greeting += 'Morning';
    else if (hour < 18) greeting += 'Afternoon';
    else greeting += 'Evening';
    
    greetingEl.textContent = greeting;
  }
  
  if (timeEl) {
    timeEl.textContent = new Date().toLocaleTimeString();
  }
  
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString();
  }
}

// Update greeting and time every second
setInterval(updateGreeting, 1000);

// Initial call
updateGreeting();

// Update Profile Picture After Registration
function updateProfilePicture() {
  const joinProviderBtn = document.getElementById('joinProviderBtn');
  const profilePicContainer = document.getElementById('profilePicContainer');
  const providerProfilePic = document.getElementById('providerProfilePic');

  // Check if user is registered as a provider
  const isProviderRegistered = localStorage.getItem('isProviderRegistered');
  const providerProfileImage = localStorage.getItem('providerProfileImage');

  if (isProviderRegistered === 'true' && providerProfileImage) {
    // Hide join button
    if (joinProviderBtn) {
      joinProviderBtn.style.display = 'none';
    }

    // Show profile picture
    if (profilePicContainer) {
      profilePicContainer.style.display = 'block';
    }

    // Set profile picture source
    if (providerProfilePic) {
      providerProfilePic.src = providerProfileImage;
    }
  }
}

// Call updateProfilePicture on page load
document.addEventListener('DOMContentLoaded', updateProfilePicture);
