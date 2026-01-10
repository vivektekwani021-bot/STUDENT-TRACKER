import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const FeedbackPanel = ({ isOpen, isCorrect, explanation, onNext }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop (Click to close is implied by button) */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Panel */}
                    <motion.div
                        className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#161B22] border-l border-white/10 z-50 flex flex-col shadow-2xl"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`mb-10 inline-flex items-center gap-3 px-6 py-3 rounded-full border ${isCorrect
                                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}
                            >
                                {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                <span className="text-lg font-medium">{isCorrect ? 'That is correct!' : 'Not quite right'}</span>
                            </motion.div>

                            <h3 className="text-3xl font-display font-medium text-white mb-6">Why?</h3>
                            <div className="prose prose-invert prose-lg text-secondary leading-relaxed">
                                {/* We can render markdown or text here */}
                                <p>{explanation}</p>
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 bg-[#0D1117]">
                            <button
                                onClick={onNext}
                                autoFocus
                                className="w-full py-5 bg-white text-black text-xl font-bold rounded-2xl hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                            >
                                <span>Next Challenge</span>
                                <ArrowRight size={24} />
                            </button>
                            <div className="text-center mt-4">
                                <span className="text-xs text-secondary uppercase tracking-widest">Press Enter to continue</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FeedbackPanel;
