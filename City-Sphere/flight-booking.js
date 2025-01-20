// Flight Booking Page Interactions
document.addEventListener('DOMContentLoaded', () => {
    const bookButtons = document.querySelectorAll('.button');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const flightCard = event.target.closest('.flight-card');
            const flightDetails = flightCard.querySelector('.flight-details');
            const flightName = flightDetails.querySelector('h3').textContent;
            
            // Placeholder for booking logic
            alert(`Booking ticket for: ${flightName}`);
        });
    });
});
