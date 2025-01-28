// Global elements object to be initialized on DOMContentLoaded
let elements = {};

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Dynamic Greeting
function updateGreeting() {
  const greetingEl = document.getElementById('greeting');
  
  if (greetingEl) {
    const hour = new Date().getHours();
    let greeting = 'Good ';
    
    if (hour < 12) greeting += 'Morning';
    else if (hour < 18) greeting += 'Afternoon';
    else greeting += 'Evening';
    
    greetingEl.textContent = greeting;
  }
}

// Update time and date with performance optimization
const updateDateTime = debounce(() => {
  try {
    const now = new Date();

    if (elements.time) {
      elements.time.textContent = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (elements.date) {
      elements.date.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  } catch (error) {
    console.error("Error updating date/time:", error);
  }
}, 1000);

// Mobile menu functionality with improved touch handling
function initMobileMenu() {
  if (!elements.hamburger || !elements.navWrapper) return;

  const toggleMenu = () => {
    elements.hamburger.classList.toggle("active");
    elements.navWrapper.classList.toggle("active");
  };

  elements.hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      elements.navWrapper.classList.contains("active") &&
      !elements.hamburger.contains(e.target) &&
      !elements.navWrapper.contains(e.target)
    ) {
      toggleMenu();
    }
  });

  // Handle touch events
  document.addEventListener(
    "touchstart",
    (e) => {
      if (
        elements.navWrapper.classList.contains("active") &&
        !elements.hamburger.contains(e.target) &&
        !elements.navWrapper.contains(e.target)
      ) {
        toggleMenu();
      }
    },
    { passive: true }
  );
}

// Scroll animations with Intersection Observer and performance optimization
function initScrollAnimations() {
  if (!elements.serviceCards.length && !elements.featureCards.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const animateOnScroll = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  };

  const observer = new IntersectionObserver(animateOnScroll, observerOptions);

  elements.serviceCards.forEach((card) => observer.observe(card));
  elements.featureCards.forEach((card) => observer.observe(card));
}

// Smooth scroll with performance optimization
const smoothScroll = debounce((target) => {
  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, 300);

// Authentication State Management
function updateAuthState() {
  const authToken = localStorage.getItem("authToken");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userProfileBtn = document.getElementById("userProfileBtn");

  if (authToken) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
    if (userProfileBtn) userProfileBtn.style.display = "block";
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userProfileBtn) userProfileBtn.style.display = "none";
  }
}

// Global logout function
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userDetails");
  updateAuthState();
  window.location.href = "/index.html";
}

// Initialize App
function initializeApp() {
  // Initialize global elements
  elements = {
    hamburger: document.querySelector(".hamburger"),
    navWrapper: document.querySelector(".nav-wrapper"),
    serviceCards: document.querySelectorAll(".service-card"),
    featureCards: document.querySelectorAll(".feature-card"),
    time: document.getElementById("time"),
    date: document.getElementById("date"),
  };

  // Call initialization functions
  updateGreeting();
  updateDateTime();
  initMobileMenu();
  initScrollAnimations();
  updateAuthState();

  // Event listeners
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        smoothScroll(target);
      }
    });
  });

  // Periodic updates
  setInterval(updateDateTime, 60000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

// Add service worker registration for offline functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
