import apiService from './api.service.js';

class AppointmentService {
    constructor() {
        this.novasApiBaseUrl = 'http://localhost:3000/api/novas';
    }

    async createAppointment(appointmentData) {
        try {
            // First, save appointment in City Sphere
            const citySphereResponse = await apiService.request('/appointments', {
                method: 'POST',
                body: JSON.stringify(appointmentData)
            });

            if (!citySphereResponse.success) {
                throw new Error('Failed to create appointment in City Sphere');
            }

            // Then, sync with City Novas
            const novasResponse = await fetch(`${this.novasApiBaseUrl}/appointments/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...appointmentData,
                    citySphereAppointmentId: citySphereResponse.appointmentId
                })
            });

            if (!novasResponse.ok) {
                throw new Error('Failed to sync appointment with City Novas');
            }

            // Save appointment to localStorage for immediate display
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.push({
                ...appointmentData,
                id: citySphereResponse.appointmentId,
                status: 'Pending',
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('appointments', JSON.stringify(appointments));

            return {
                success: true,
                appointmentId: citySphereResponse.appointmentId
            };
        } catch (error) {
            console.error('Appointment creation failed:', error);
            throw error;
        }
    }

    async updateAppointmentStatus(appointmentId, status) {
        try {
            // Update status in City Sphere
            const citySphereResponse = await apiService.request(`/appointments/${appointmentId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });

            if (!citySphereResponse.success) {
                throw new Error('Failed to update appointment status in City Sphere');
            }

            // Sync status with City Novas
            const novasResponse = await fetch(`${this.novasApiBaseUrl}/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status })
            });

            if (!novasResponse.ok) {
                throw new Error('Failed to sync appointment status with City Novas');
            }

            // Update status in localStorage
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const updatedAppointments = appointments.map(app => {
                if (app.id === appointmentId) {
                    return { ...app, status };
                }
                return app;
            });
            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

            return { success: true };
        } catch (error) {
            console.error('Appointment status update failed:', error);
            throw error;
        }
    }

    async getAppointments() {
        try {
            const response = await apiService.request('/appointments');
            if (response.success) {
                localStorage.setItem('appointments', JSON.stringify(response.appointments));
                return response.appointments;
            }
            throw new Error('Failed to fetch appointments');
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            throw error;
        }
    }
}

export default new AppointmentService();