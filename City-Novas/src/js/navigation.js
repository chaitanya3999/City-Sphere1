// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navWrapper = document.querySelector('.nav-wrapper');

  if (hamburger && navWrapper) {
    hamburger.addEventListener('click', () => {
      navWrapper.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!navWrapper.contains(event.target) && !hamburger.contains(event.target)) {
      navWrapper.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });

  // Profile Picture Navigation
  const profilePicContainer = document.getElementById('profilePicContainer');
  const joinProviderBtn = document.getElementById('joinProviderBtn');

  if (profilePicContainer) {
    profilePicContainer.addEventListener('click', () => {
      window.location.href = 'provider-dashboard.html';
    });
  }
});
