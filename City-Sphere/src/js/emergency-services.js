// Emergency Services Page Interactions
document.addEventListener('DOMContentLoaded', () => {
    const emergencyCallButtons = document.querySelectorAll('.emergency-call');
    const emergencyLocationButtons = document.querySelectorAll('.emergency-location');
    
    emergencyCallButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const emergencyCard = event.target.closest('.emergency-card');
            const emergencyDetails = emergencyCard.querySelector('.emergency-details');
            const serviceName = emergencyDetails.querySelector('h3').textContent;
            const helpline = emergencyDetails.querySelector('p:nth-child(5)').textContent.split(': ')[1];
            
            // Placeholder for emergency call logic
            alert(`Calling ${serviceName} Emergency Services at ${helpline}`);
        });
    });

    emergencyLocationButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const emergencyCard = event.target.closest('.emergency-card');
            const emergencyDetails = emergencyCard.querySelector('.emergency-details');
            const serviceName = emergencyDetails.querySelector('h3').textContent;
            
            // Placeholder for location sharing logic
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        alert(`Sharing location for ${serviceName} Emergency Services\nLatitude: ${latitude}\nLongitude: ${longitude}`);
                    },
                    (error) => {
                        alert(`Error getting location for ${serviceName} Emergency Services: ${error.message}`);
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        });
    });
});
