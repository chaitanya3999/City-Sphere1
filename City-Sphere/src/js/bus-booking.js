// Bus Booking Page Interactions
document.addEventListener('DOMContentLoaded', () => {
    const bookButtons = document.querySelectorAll('.button');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const busCard = event.target.closest('.bus-card');
            const busDetails = busCard.querySelector('.bus-details');
            const busName = busDetails.querySelector('h3').textContent;
            
            // Placeholder for booking logic
            alert(`Booking ticket for: ${busName}`);
        });
    });
});
