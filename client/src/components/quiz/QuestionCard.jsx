import { motion } from 'framer-motion';
import { useEffect } from 'react';

const QuestionCard = ({ question, onAnswer, selectedOption, disabled }) => {
    useEffect(() => {
        if (disabled) return;

        const handleKeyDown = (e) => {
            if (e.key >= '1' && e.key <= '4') {
                const index = parseInt(e.key) - 1;
                if (index < question.options.length) {
                    onAnswer(index);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [question, onAnswer, disabled]);

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[60vh]">
            <motion.h2
                key={question.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-display font-medium text-white mb-20 text-center leading-tight tracking-tight drop-shadow-2xl"
            >
                {question.text}
            </motion.h2>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {question.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;

                    return (
                        <motion.button
                            key={idx}
                            onClick={() => !disabled && onAnswer(idx)}
                            disabled={disabled}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
                            whileTap={!disabled ? { scale: 0.98 } : {}}
                            className={`relative p-8 rounded-2xl text-left border transition-all duration-300 flex flex-col min-h-[160px] justify-end group overflow-hidden ${isSelected
                                    ? 'bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.2)]'
                                    : 'bg-[#161B22] border-white/5 hover:bg-[#21262D] hover:border-white/20'
                                } ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {/* Optional Keyboard Badge Hint */}
                            <div className={`absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center border text-sm font-mono transition-colors ${isSelected ? 'border-black/20 text-black/50' : 'border-white/10 text-white/30 group-hover:border-white/20 group-hover:text-white/60'
                                }`}>
                                {idx + 1}
                            </div>

                            <span className={`text-2xl md:text-3xl font-medium tracking-tight ${isSelected ? 'text-black' : 'text-white group-hover:text-primary transition-colors'}`}>
                                {option}
                            </span>

                            {/* Selected Gradient Glow */}
                            {isSelected && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/40 pointer-events-none"
                                    layoutId="selected-glow"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionCard;
