document.addEventListener('DOMContentLoaded', () => {
    // Responsive sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('#sidebarToggle') && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // Update provider name
    const providerNameHeader = document.getElementById('providerNameHeader');
    // TODO: Replace with actual API call to get provider name
    const providerName = 'John Doe';
    if (providerNameHeader) {
        providerNameHeader.textContent = `Welcome, ${providerName}`;
    }

    // Make tables responsive
    const dataTables = document.querySelectorAll('.data-table');
    function makeTablesResponsive() {
        dataTables.forEach(table => {
            const headerCells = table.querySelectorAll('thead th');
            const headerTexts = Array.from(headerCells).map(th => th.textContent);
            const bodyCells = table.querySelectorAll('tbody td');

            bodyCells.forEach((cell, index) => {
                const headerIndex = index % headerTexts.length;
                cell.setAttribute('data-label', headerTexts[headerIndex]);
            });
        });
    }

    // Call makeTablesResponsive initially and on window resize
    makeTablesResponsive();
    window.addEventListener('resize', makeTablesResponsive);

    // Handle notifications
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            // TODO: Implement notifications panel
            console.log('Notifications clicked');
        });
    }

    // Update stats periodically (mock data for demonstration)
    function updateStats() {
        const bookingsNumber = document.querySelector('.stat-card:nth-child(1) .stat-number');
        const revenueNumber = document.querySelector('.stat-card:nth-child(2) .stat-number');
        const servicesNumber = document.querySelector('.stat-card:nth-child(3) .stat-number');

        // TODO: Replace with actual API calls
        if (bookingsNumber) bookingsNumber.textContent = Math.floor(Math.random() * 100);
        if (revenueNumber) revenueNumber.textContent = `₹${Math.floor(Math.random() * 100000)}`;
        if (servicesNumber) servicesNumber.textContent = Math.floor(Math.random() * 10);
    }

    // Update stats every 5 minutes
    setInterval(updateStats, 300000);
});
