// Metro Booking Page Interactions
document.addEventListener('DOMContentLoaded', () => {
    const bookButtons = document.querySelectorAll('.button');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const metroCard = event.target.closest('.metro-card');
            const metroDetails = metroCard.querySelector('.metro-details');
            const metroName = metroDetails.querySelector('h3').textContent;
            
            // Placeholder for booking logic
            alert(`Booking ticket for: ${metroName}`);
        });
    });
});
