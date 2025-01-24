document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Navigation
    const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
        });
    });

    // Logout Functionality
    const logoutBtn = document.querySelector('.btn-logout');
    logoutBtn.addEventListener('click', () => {
        // Implement logout logic
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    });

    // Notification Interaction
    const notificationIcon = document.querySelector('.notification-icon');
    notificationIcon.addEventListener('click', () => {
        // TODO: Implement notification dropdown or modal
        alert('You have 3 new notifications');
    });

    // Dynamic Data Loading (Simulated)
    function loadProviderData() {
        // In a real app, this would come from an API
        const providerName = localStorage.getItem('providerName') || 'John Doe';
        document.getElementById('provider-name').textContent = providerName;
    }

    loadProviderData();
});
