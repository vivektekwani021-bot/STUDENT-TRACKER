import { create } from 'zustand';

const useStore = create((set) => ({
    // Session State
    session: null,
    setSession: (session) => set({ session }),

    // UI State
    mode: 'canvas', // 'canvas', 'learning', 'challenge', 'reflection'
    setMode: (mode) => set({ mode }),

    // Learning Flow State
    currentTopic: null,
    setCurrentTopic: (topic) => set({ currentTopic: topic }),

    // Quiz State (Temporary)
    quizState: {
        active: false,
        questions: [],
        currentIndex: 0,
        score: 0,
    },
    setQuizState: (state) => set((prev) => ({ quizState: { ...prev.quizState, ...state } })),
    resetQuiz: () => set({ quizState: { active: false, questions: [], currentIndex: 0, score: 0 } }),
}));

export default useStore;
