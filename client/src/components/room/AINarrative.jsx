import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronDown, Sparkles, Copy, Check } from 'lucide-react';

const AINarrative = ({ content }) => {
    const [visibleIndex, setVisibleIndex] = useState(0);
    const scrollRef = useRef(null);

    // Mock chunks if null (though parent handles this)
    const chunks = content?.chunks || [];

    // Auto-scroll to bottom when new chunk is revealed
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [visibleIndex]);

    return (
        <div className="relative h-full flex flex-col w-full max-w-4xl mx-auto">
            {/* Header omitted here as it's in parent, but we can add specific chat controls if needed */}

            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12 scroll-smooth pb-40">
                {chunks.map((chunk, index) => {
                    if (index > visibleIndex) return null;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="group"
                        >
                            {chunk.type === 'heading' && (
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="mt-1.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <Sparkles size={14} className="text-primary" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">{chunk.content}</h2>
                                </div>
                            )}

                            {chunk.type === 'text' && (
                                <div className="pl-12">
                                    <p className="text-lg text-gray-300 leading-relaxed font-light tracking-wide">{chunk.content}</p>
                                </div>
                            )}

                            {chunk.type === 'code' && (
                                <div className="pl-12 mt-6">
                                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0D1117] ring-1 ring-white/5">
                                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                                </div>
                                                <span className="text-xs text-gray-400 font-mono ml-2">{chunk.language}</span>
                                            </div>
                                            <button className="p-1 hover:bg-white/10 rounded transition-colors text-gray-500 hover:text-white" title="Copy Code">
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                        <SyntaxHighlighter
                                            language={chunk.language}
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, background: 'transparent', padding: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}
                                            wrapLines={true}
                                            showLineNumbers={true}
                                            lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#444', textAlign: 'right' }}
                                        >
                                            {chunk.content}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )
                })}

                {/* Spacer for bottom */}
                <div className="h-12" />
            </div>

            {/* Sticky Reveal Control */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-[#050510] via-[#050510]/95 to-transparent flex justify-center pointer-events-none">
                <AnimatePresence>
                    {visibleIndex < chunks.length - 1 ? (
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            onClick={() => setVisibleIndex(prev => prev + 1)}
                            className="pointer-events-auto group relative px-8 py-3 rounded-full bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Continue Learning</span>
                            <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                        </motion.button>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-2 rounded-full backdrop-blur-md flex items-center gap-2"
                        >
                            <Check size={16} />
                            <span className="font-medium">Explanation Complete</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AINarrative;
