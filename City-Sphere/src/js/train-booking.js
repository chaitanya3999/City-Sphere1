// Train Booking Page Interactions
document.addEventListener('DOMContentLoaded', () => {
    const bookButtons = document.querySelectorAll('.button');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const trainCard = event.target.closest('.train-card');
            const trainDetails = trainCard.querySelector('.train-details');
            const trainName = trainDetails.querySelector('h3').textContent;
            
            // Placeholder for booking logic
            alert(`Booking ticket for: ${trainName}`);
        });
    });
});
