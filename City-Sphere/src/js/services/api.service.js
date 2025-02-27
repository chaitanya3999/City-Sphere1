const API_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:5000';  // Updated to use correct backend URL
        this.token = localStorage.getItem('token');
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async request(endpoint, options = {}) {
        const url = this.baseUrl + endpoint;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` })
        };

        try {
            console.log('Making API request to:', url);
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                },
                credentials: 'include'
            });

            // For logout request, don't try to parse JSON
            if (endpoint === '/auth/logout' && response.status === 200) {
                return { success: true };
            }

            // Try to parse the response as JSON
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = await response.json();
                } catch (e) {
                    console.error('Failed to parse JSON response:', e);
                    throw new Error('Invalid server response');
                }
            } else {
                throw new Error('Invalid response type from server');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (response.success && response.token) {
                this.token = response.token;
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            console.log('Sending registration data:', userData);
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            console.log('Registration response:', response);
            return {
                success: true,
                message: 'Registration successful',
                data: response
            };
        } catch (error) {
            console.error('Registration request failed:', error);
            return {
                success: false,
                message: error.message || 'Registration failed'
            };
        }
    }

    async logout() {
        try {
            // Show loading overlay
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) loadingOverlay.classList.remove('hide');

            // Clear all local storage first
            this.token = null;
            localStorage.clear();

            // Make logout request
            await this.request('/auth/logout', {
                method: 'POST'
            });

            // Redirect to login page
            window.location.href = '/City-Sphere1/City-Sphere/src/html/auth.html';
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        } finally {
            // Hide loading overlay
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) loadingOverlay.classList.add('hide');
        }
    }

    async checkAuth() {
        try {
            // Check if token exists
            if (!this.token) {
                return false;
            }

            // Check token expiration (if last login was more than 24 hours ago)
            const lastLoginTime = localStorage.getItem('lastLoginTime');
            if (lastLoginTime && Date.now() - parseInt(lastLoginTime) > 24 * 60 * 60 * 1000) {
                this.logout();
                return false;
            }

            const response = await this.request('/auth/check');
            return response.authenticated === true;
        } catch (error) {
            console.error('Auth check failed:', error);
            if (error.message === 'Token expired' || error.message === 'Invalid token') {
                this.logout();
            }
            return false;
        }
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }
}

const apiService = new ApiService();
export default apiService;
