const API_URL = '/api';

class ApiService {
    constructor() {
        this.baseUrl = 'http://127.0.0.1:5501/api';  // Updated to use port 5501
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

            const data = await response.json();

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
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

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

            // Then make the logout request
            await this.request('/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            // Hide loading overlay if it exists
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) loadingOverlay.classList.add('hide');
            
            // Always redirect to login page, even if request fails
            window.location.replace('http://127.0.0.1:5501/src/html/auth.html');
        }
    }

    async checkAuth() {
        try {
            const response = await this.request('/auth/check');
            return response.authenticated === true;
        } catch (error) {
            console.error('Auth check failed:', error);
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
