import apiService from './services/api.service.js';

document.addEventListener('DOMContentLoaded', async function() {
    const navbarRight = document.querySelector('.navbar-right');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Show/hide loading overlay
    const showLoading = () => loadingOverlay?.classList.remove('hide');
    const hideLoading = () => loadingOverlay?.classList.add('hide');

    async function updateNavigation() {
        try {
            showLoading();
            const { user } = await apiService.getUserProfile();

            if (user) {
                // Replace login button with user dropdown
                navbarRight.innerHTML = `
                    <div class="user-dropdown">
                        <button class="dropdown-btn">
                            <i class="fas fa-user-circle"></i>
                            <span>${user.name}</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-content">
                            <a href="profile.html">
                                <i class="fas fa-user"></i> Profile
                            </a>
                            <a href="user-dashboard.html">
                                <i class="fas fa-tachometer-alt"></i> Dashboard
                            </a>
                            <a href="settings.html">
                                <i class="fas fa-cog"></i> Settings
                            </a>
                            <a href="#" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </div>
                    </div>
                `;

                // Add logout event listener
                document.getElementById('logoutBtn').addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        showLoading();
                        await apiService.logout();
                        window.location.href = 'index.html';
                    } catch (error) {
                        console.error('Logout failed:', error);
                        hideLoading();
                    }
                });

                // Add dropdown toggle functionality
                const dropdownBtn = document.querySelector('.dropdown-btn');
                const dropdownContent = document.querySelector('.dropdown-content');

                dropdownBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownContent.classList.toggle('show');
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!navbarRight.contains(e.target)) {
                        dropdownContent.classList.remove('show');
                    }
                });
            } else {
                // Show login button
                navbarRight.innerHTML = `
                    <a href="auth.html" class="btn-login">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </a>
                `;
            }
        } catch (error) {
            console.error('Failed to update navigation:', error);
            // If not authenticated, show login button
            navbarRight.innerHTML = `
                <a href="auth.html" class="btn-login">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
            `;
        } finally {
            hideLoading();
        }
    }

    // Update navigation on page load
    await updateNavigation();
});
