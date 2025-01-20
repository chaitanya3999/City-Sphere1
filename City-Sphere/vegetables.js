document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('vegetablesOrderForm');
  const calculateTotalBtn = document.querySelector('.btn-calculate-total');
  const estimatedTotalDisplay = document.getElementById('estimatedTotal');
  const orderIdDisplay = document.getElementById('orderIdDisplay');
  const orderDateDisplay = document.getElementById('orderDateDisplay');

  // Generate random order ID
  function generateOrderId() {
    const prefix = 'VEG-';
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return prefix + randomNumber;
  }

  // Set current date
  function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Calculate estimated total (mock function)
  function calculateTotal() {
    const mode = document.getElementById('mode').value;
    const deliveryTime = document.getElementById('delivery-time').value;
    
    let baseTotal = 0;
    
    switch(mode) {
      case 'upload-list':
        baseTotal = 300;
        break;
      case 'give-in-text':
        baseTotal = 250;
        break;
      case 'select-by-options':
        baseTotal = 275;
        break;
      default:
        baseTotal = 0;
    }

    // Add delivery time premium
    switch(deliveryTime) {
      case 'morning':
        baseTotal += 50;
        break;
      case 'evening':
        baseTotal += 75;
        break;
    }

    return baseTotal;
  }

  // File upload interaction
  const fileUploadInput = document.getElementById('file');
  const fileUploadLabel = document.querySelector('.file-upload-label');

  fileUploadInput.addEventListener('change', function(e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
    fileUploadLabel.innerHTML = `
      <i class="fas fa-file-upload"></i>
      <span>${fileName}</span>
    `;
  });

  // Calculate total button
  calculateTotalBtn.addEventListener('click', function() {
    const total = calculateTotal();
    estimatedTotalDisplay.textContent = `₹ ${total.toFixed(2)}`;
  });

  // Set order ID and date on page load
  orderIdDisplay.textContent = generateOrderId();
  orderDateDisplay.textContent = getCurrentDate();

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Vegetables Order Submitted Successfully!');
    // Here you would typically send the form data to a backend service
  });
});
