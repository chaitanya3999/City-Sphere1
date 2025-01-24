// Custom Authentication Module
class AuthService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
    }

    // Validate phone or email
    validatePhoneOrEmail(input) {
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return phoneRegex.test(input) || emailRegex.test(input);
    }

    // Validate password strength
    validatePassword(password) {
        return password.length >= 8;
    }

    async signup(phoneEmail, password) {
        if (!this.validatePhoneOrEmail(phoneEmail)) {
            throw new Error('Invalid phone number or email');
        }

        if (!this.validatePassword(password)) {
            throw new Error('Password must be at least 8 characters long');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/signup`, {
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
                throw new Error(data.error || 'Signup failed');
            }

            // Store authentication data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userProfile', JSON.stringify(data.user));

            return data;
        } catch (error) {
            console.error('Signup Error:', error);
            throw error;
        }
    }

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
            localStorage.setItem('token', data.token);
            localStorage.setItem('userProfile', JSON.stringify(data.user));

            return data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    }

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
            localStorage.setItem('token', data.token);
            localStorage.setItem('userProfile', JSON.stringify(data.user));

            return data;
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        // Optional: Call backend logout endpoint
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getCurrentUser() {
        const userProfile = localStorage.getItem('userProfile');
        return userProfile ? JSON.parse(userProfile) : null;
    }
}

// Export as singleton
export default new AuthService();
