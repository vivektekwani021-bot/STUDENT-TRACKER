import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';

// --- Queries ---

export const useUser = (options = {}) => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data } = await api.get('/auth/me');
            return data.user;
        },
        retry: false,
        ...options
    })
}

export const useLearningHistory = () => {
    return useQuery({
        queryKey: ['learningHistory'],
        queryFn: async () => {
            const { data } = await api.get('/auth/me');
            return data.user?.learningHistory || [];
        },
    });
};

export const useWeakTopics = () => {
    return useQuery({
        queryKey: ['weakTopics'],
        queryFn: async () => {
            const { data } = await api.get('/auth/me');
            return data.user?.weakTopics || [];
        },
    });
};

// --- Mutations ---

export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials) => {
            const { data } = await api.post('/auth/login', credentials);
            return data;
        }
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (credentials) => {
            const { data } = await api.post('/auth/register', credentials);
            return data;
        }
    });
};

export const useGenerateContent = () => {
    return useMutation({
        mutationFn: async ({ topic, prompt }) => {
            // API expects { topic, prompt }
            const { data } = await api.post('/learning/content', { topic, prompt });
            return data;
        },
    });
};

export const useGenerateQuiz = () => {
    return useMutation({
        mutationFn: async ({ topic }) => {
            const { data } = await api.post('/quiz/generate', { topic });
            return data;
        },
    });
};

export const useSubmitQuiz = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post('/quiz/submit', payload);
            return data;
        },
    });
};

export const useMarkLearned = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post('/learning/complete', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['learningHistory']);
            queryClient.invalidateQueries(['weakTopics']);
            queryClient.invalidateQueries(['user']);
        },
    });
};

export const useDownloadNotes = () => {
    return useMutation({
        mutationFn: async ({ topic, prompt }) => {
            const response = await api.post('/pdf/notes', { topic, prompt }, {
                responseType: 'blob' // Important for PDF download
            });
            return response.data;
        },
    });
};

export const useGetAttendance = () => {
    return useQuery({
        queryKey: ['attendance'],
        queryFn: async () => {
            const { data } = await api.get('/attendance');
            return data;
        },
    });
};

export const useMarkSchoolAttendance = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post('/attendance/school', payload);
            return data;
        },
    });
};

export const useMarkSubjectAttendance = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post('/attendance/college', payload);
            return data;
        },
    });
};

// --- Habits ---
export const useHabits = () => {
    return useQuery({
        queryKey: ['habits'],
        queryFn: async () => {
            const { data } = await api.get('/habit');
            return data.habits;
        },
    });
};

export const useCreateHabit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post('/habit', payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries(['habits'])
    });
};

export const useMarkHabit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, date }) => {
            const { data } = await api.post(`/habit/${id}/mark`, { date });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries(['habits'])
    });
};

// --- Placements ---
export const usePlacements = () => {
    return useQuery({
        queryKey: ['placements'],
        queryFn: async () => {
            const { data } = await api.get('/placement');
            return data.placements;
        },
    });
};

export const useCreatePlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post('/placement/create', payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries(['placements'])
    });
};

export const useApplyPlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await api.post(`/placement/${id}/apply`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries(['placements'])
    });
};
