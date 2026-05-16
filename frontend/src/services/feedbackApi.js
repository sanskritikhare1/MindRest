import api from './api';

export const feedbackApi = {
    submitFeedback: async (rating, comment) => {
        const { data } = await api.post('/feedback', { rating, comment });
        return data;
    },

    submitContact: async (formData) => {
        const { data } = await api.post('/contact', formData);
        return data;
    }
};

