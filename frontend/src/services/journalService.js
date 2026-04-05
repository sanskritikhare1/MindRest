import api from './api';

export const journalService = {
    // GET /api/journal
    getEntries: async (page = 1) => {
        try {
            const { data } = await api.get(`/journal?page=${page}`);
            return data;
        } catch (error) {
            if (error.response?.status === 401) {
                // ❌ stop redirect loop
                localStorage.removeItem("token");
                throw new Error("Unauthorized");
            }
            throw error;
        }
    },

    // POST /api/journal
    createEntry: async (title, content, mood_tag) => {
        try {
            const { data } = await api.post('/journal', {
                title,
                content,
                mood_tag
            });
            return data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                throw new Error("Unauthorized");
            }
            throw error;
        }
    },

    // DELETE /api/journal/:id
    deleteEntry: async (id) => {
        try {
            const { data } = await api.delete(`/journal/${id}`);
            return data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                throw new Error("Unauthorized");
            }
            throw error;
        }
    },
};