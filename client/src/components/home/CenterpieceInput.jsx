import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const placeholders = [
    "What are you curious about?",
    "Master Binary Search?",
    "How do APIs work?",
    "Understand React Hooks?",
    "Explore Quantum Computing?"
];

const CenterpieceInput = () => {
    const [inputValue, setInputValue] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const setMode = useStore((state) => state.setMode);
    const setCurrentTopic = useStore((state) => state.setCurrentTopic);

    useEffect(() => {
        if (inputValue) return; // Stop cycling if user is typing
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [inputValue]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            setCurrentTopic(inputValue);
            setMode('learning');
            // Navigate to learning room (will implement route later)
            navigate('/learn');
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto z-20">
            <motion.div
                layoutId="search-bar"
                className={`relative flex items-center bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${isFocused ? 'shadow-[0_0_30px_rgba(88,166,255,0.15)] border-primary/30' : 'shadow-lg'
                    }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                <div className="pl-6 text-secondary">
                    <Search size={24} />
                </div>

                <div className="relative flex-1 h-16">
                    <AnimatePresence mode="wait">
                        {!inputValue && (
                            <motion.span
                                key={placeholderIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 0.4 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 flex items-center pl-4 text-xl text-secondary pointer-events-none select-none font-light"
                            >
                                {placeholders[placeholderIndex]}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    <input
                        type="text"
                        className="w-full h-full bg-transparent border-none outline-none text-xl px-4 text-white placeholder-transparent font-medium"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default CenterpieceInput;
