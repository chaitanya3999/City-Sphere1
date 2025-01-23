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
