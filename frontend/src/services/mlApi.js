import api from './api';

export const mlApi = {
    getPrediction: async (inputs) => {
        // 1. Retrieve the token saved during login
        const token = localStorage.getItem("token");

        // Simple safety check
        if (!token) {
            console.error("No authentication token found. Please log in.");
            throw new Error("Authentication required");
        }

        // Uses the centralized api instance which reads VITE_API_BASE_URL
        const { data } = await api.post('/assessment', {
            sleep_hours: inputs.sleep,
            stress_level: inputs.stress,
            screen_time: inputs.screentime,
            mood_rating: inputs.mood
        });

        // Return the full object so Assessment.jsx can access data.risk_label
        return data;
    },
};