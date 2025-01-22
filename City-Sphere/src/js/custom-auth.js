// Custom Authentication Module
class AuthService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
    }

    async signup(userData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userSignupData', JSON.stringify(data.user));

            return data;
        } catch (error) {
            console.error('Signup Error:', error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userSignupData', JSON.stringify(data.user));

            return data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    }

    async getUserProfile() {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch profile');
            }

            return data;
        } catch (error) {
            console.error('Profile Fetch Error:', error);
            throw error;
        }
    }

    async updateUserProfile(profileData) {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Profile update failed');
            }

            return data;
        } catch (error) {
            console.error('Profile Update Error:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userSignupData');
        window.location.href = 'index.html';
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}

// Export as singleton
export default new AuthService();
