import { Lightbulb, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWeakTopics } from '../../api/queries';

const SmartSuggestions = () => {
    const { data: weakTopics } = useWeakTopics();
    const suggestions = weakTopics?.length > 0 ? weakTopics : ["Graph Theory", "Dynamic Programming"];
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative p-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-md rounded-full border border-yellow-400/30 cursor-pointer transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                whileHover={{ scale: 1.1, rotate: 15 }}
            >
                <Lightbulb size={24} className="text-yellow-400" />
            </motion.div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10, x: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, x: -10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute bottom-full right-0 mb-6 mr-[-20px] w-72 p-5 bg-[#161B22]/95 border border-white/10 rounded-2xl shadow-2xl z-50 origin-bottom-right backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                            <p className="text-xs text-secondary uppercase font-bold tracking-wider">Focus Area</p>
                        </div>

                        <p className="text-sm text-white mb-4 leading-relaxed">
                            It looks like <span className="text-white font-bold underline decoration-red-400/50 underline-offset-2">{suggestions[0]}</span> is a weak spot. Want to turn it into a strength?
                        </p>

                        <button className="w-full py-2.5 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wide transition-transform active:scale-95 flex items-center justify-center gap-2">
                            <span>Start Practice Session</span>
                            <ArrowUpRight size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartSuggestions;
