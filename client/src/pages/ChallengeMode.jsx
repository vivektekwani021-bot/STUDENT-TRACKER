import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import QuestionCard from '../components/quiz/QuestionCard';
import FeedbackPanel from '../components/quiz/FeedbackPanel';
import { X, Trophy, Loader2 } from 'lucide-react';
import { useGenerateQuiz, useSubmitQuiz } from '../api/queries';

const ChallengeMode = () => {
    const navigate = useNavigate();
    const currentTopic = useStore((state) => state.currentTopic);
    const setMode = useStore((state) => state.setMode);

    const generateQuiz = useGenerateQuiz();
    const submitQuiz = useSubmitQuiz();

    const [quizData, setQuizData] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);

    useEffect(() => {
        if (!currentTopic) {
            navigate('/');
            return;
        }

        if (!quizData && !generateQuiz.isPending) {
            generateQuiz.mutateAsync({ topic: currentTopic })
                .then(data => {
                    setQuizData(data);
                    // Map backend questions to frontend format
                    const mappedQuestions = data.questions.map((q, i) => ({
                        id: i,
                        text: q.question || q.text,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation || "No explanation provided."
                    }));
                    setQuestions(mappedQuestions);
                })
                .catch(err => console.error("Quiz Gen Error:", err));
        }
    }, [currentTopic, navigate]);

    const handleAnswer = (index) => {
        setSelectedOption(index);

        const currentQ = questions[currentQIndex];
        // Check correctness (assuming correctAnswer is index)
        const correct = index === currentQ.correctAnswer;
        setIsCorrect(correct);

        // Store answer
        const newAnswers = [...userAnswers];
        newAnswers[currentQIndex] = index;
        setUserAnswers(newAnswers);

        setTimeout(() => setShowFeedback(true), 600);
    };

    const handleNext = async () => {
        setShowFeedback(false);
        setSelectedOption(null);

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            // Finish Quiz
            if (quizData?.quizId) {
                try {
                    await submitQuiz.mutateAsync({
                        quizId: quizData.quizId,
                        answers: userAnswers
                    });
                } catch (e) {
                    console.error("Submit failed", e);
                }
            }
            setMode('canvas');
            navigate('/');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && showFeedback) {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showFeedback, currentQIndex, questions]);

    if (generateQuiz.isPending || !questions.length) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-white/60">Generating Challenges...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-background flex flex-col relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-background/50 radial-gradient-center pointer-events-none" />

            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-6">
                <div className="flex items-center gap-3 text-white/50">
                    <Trophy size={18} />
                    <span className="text-sm font-mono tracking-widest uppercase">Challenge Mode</span>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1 bg-white/5 w-full z-20">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="flex-1 flex items-center justify-center relative z-10">
                <QuestionCard
                    question={questions[currentQIndex]}
                    onAnswer={handleAnswer}
                    selectedOption={selectedOption}
                    disabled={showFeedback}
                />
            </div>

            <FeedbackPanel
                isOpen={showFeedback}
                isCorrect={isCorrect}
                explanation={questions[currentQIndex].explanation}
                onNext={handleNext}
            />
        </div>
    );
};

export default ChallengeMode;
