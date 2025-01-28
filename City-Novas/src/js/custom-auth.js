class AuthService {
    constructor() {
        // In a real-world scenario, replace with your actual backend URL
        this.apiBaseUrl = 'http://localhost:3000/api';
    }

    // Validate phone or email
    validatePhoneOrEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        return emailRegex.test(input) || phoneRegex.test(input);
    }

    // Validate password strength
    validatePassword(password) {
        return password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /[0-9]/.test(password) && 
               /[!@#$%^&*(),.?":{}|<>]/.test(password);
    }

    // Signup method
    async signup(phoneEmail, password, name) {
        if (!this.validatePhoneOrEmail(phoneEmail)) {
            throw new Error('Invalid phone number or email');
        }

        if (!this.validatePassword(password)) {
            throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneEmail,
                    password,
                    name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Store authentication data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username || name);
            localStorage.setItem('userDetails', JSON.stringify(data.userDetails));

            return data;
        } catch (error) {
            console.error('Signup Error:', error);
            throw error;
        }
    }

    // Login method
    async login(phoneEmail, password) {
        if (!this.validatePhoneOrEmail(phoneEmail)) {
            throw new Error('Invalid phone number or email');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    phoneEmail, 
                    password 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store authentication data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userDetails', JSON.stringify(data.userDetails));

            return data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    }

    // Google Sign-In method
    async googleSignIn(googleToken) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/google-signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: googleToken })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Google Sign-In failed');
            }

            // Store authentication data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userDetails', JSON.stringify(data.userDetails));

            return data;
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            throw error;
        }
    }

    // Check authentication status
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    // Get current user details
    getCurrentUser() {
        const userDetails = localStorage.getItem('userDetails');
        return userDetails ? JSON.parse(userDetails) : null;
    }

    // Logout method
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userDetails');
        window.location.href = '/index.html';
    }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;
