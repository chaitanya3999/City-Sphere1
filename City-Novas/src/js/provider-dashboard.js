document.addEventListener('DOMContentLoaded', () => {
    // Responsive sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mainContent = document.querySelector('.dashboard-main-content');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
        mainContent.classList.toggle('content-expanded');
    });

    // Responsive tabs
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    dashboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.getAttribute('data-target');
            
            // Remove active classes
            dashboardTabs.forEach(t => t.classList.remove('active-tab'));
            dashboardSections.forEach(s => s.classList.remove('active-section'));
            
            // Add active classes to clicked tab and corresponding section
            tab.classList.add('active-tab');
            document.querySelector(targetSection).classList.add('active-section');
        });
    });

    // Responsive data tables
    const dataTables = document.querySelectorAll('.data-table');

    function makeTablesResponsive() {
        dataTables.forEach(table => {
            const headers = Array.from(table.querySelectorAll('thead th'));
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                
                cells.forEach((cell, index) => {
                    if (window.innerWidth < 768) {
                        cell.setAttribute('data-label', headers[index].textContent);
                    } else {
                        cell.removeAttribute('data-label');
                    }
                });
            });
        });
    }

    // Service request interactions
    const serviceRequestCards = document.querySelectorAll('.service-request-card');

    serviceRequestCards.forEach(card => {
        const acceptButton = card.querySelector('.accept-request');
        const rejectButton = card.querySelector('.reject-request');

        acceptButton.addEventListener('click', () => handleServiceRequest(card, 'accept'));
        rejectButton.addEventListener('click', () => handleServiceRequest(card, 'reject'));
    });

    function handleServiceRequest(card, action) {
        const requestId = card.getAttribute('data-request-id');
        
        fetch('/api/service-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requestId, action })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                card.classList.add(action === 'accept' ? 'accepted' : 'rejected');
                card.querySelector('.request-status').textContent = action.charAt(0).toUpperCase() + action.slice(1);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        });
    }

    // Responsive layout adjustments
    function adjustLayoutForScreenSize() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth < 768) {
            document.body.classList.add('mobile-view');
            sidebar.classList.add('mobile-sidebar');
            mainContent.classList.add('mobile-content');
            
            makeTablesResponsive();
        } else {
            document.body.classList.remove('mobile-view');
            sidebar.classList.remove('mobile-sidebar');
            mainContent.classList.remove('mobile-content');
            
            // Reset table styles
            dataTables.forEach(table => {
                table.querySelectorAll('td').forEach(cell => {
                    cell.removeAttribute('data-label');
                });
            });
        }
    }

    // Initial layout adjustment and resize listener
    adjustLayoutForScreenSize();
    window.addEventListener('resize', adjustLayoutForScreenSize);
});
