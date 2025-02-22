class AppointmentService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
    }

    async getProviderAppointments() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/provider/appointments`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            return data.appointments;
        } catch (error) {
            console.error('Failed to fetch provider appointments:', error);
            throw error;
        }
    }

    async updateAppointmentStatus(appointmentId, status) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/provider/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error('Failed to update appointment status');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to update appointment status:', error);
            throw error;
        }
    }

    async getAppointmentDetails(appointmentId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/provider/appointments/${appointmentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointment details');
            }

            const data = await response.json();
            return data.appointment;
        } catch (error) {
            console.error('Failed to fetch appointment details:', error);
            throw error;
        }
    }

    async respondToAppointment(appointmentId, response) {
        try {
            const apiResponse = await fetch(`${this.apiBaseUrl}/provider/appointments/${appointmentId}/respond`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ response })
            });

            if (!apiResponse.ok) {
                throw new Error('Failed to respond to appointment');
            }

            const data = await apiResponse.json();
            return data;
        } catch (error) {
            console.error('Failed to respond to appointment:', error);
            throw error;
        }
    }
}

export default new AppointmentService();