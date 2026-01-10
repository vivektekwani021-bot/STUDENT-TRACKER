import { FileDown, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ToolDock = ({ onChallenge, onMarkLearned, onDownloadNotes }) => {
    const tools = [
        {
            id: 'notes',
            icon: FileDown,
            label: 'Download Notes',
            desc: 'Save as PDF',
            action: onDownloadNotes,
            gradient: 'from-blue-500/20 to-blue-600/5',
            border: 'border-blue-500/20',
            iconColor: 'text-blue-400'
        },
        {
            id: 'challenge',
            icon: Trophy,
            label: 'Challenge Mode',
            desc: 'Test your knowledge',
            action: onChallenge,
            gradient: 'from-amber-500/20 to-amber-600/5',
            border: 'border-amber-500/20',
            iconColor: 'text-amber-400'
        },
        {
            id: 'complete',
            icon: CheckCircle2,
            label: 'I understand this',
            desc: 'Mark topic as learned',
            action: onMarkLearned,
            gradient: 'from-green-500/20 to-green-600/5',
            border: 'border-green-500/20',
            iconColor: 'text-green-400'
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-6 h-full">
            <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest pl-1">Actions & Tools</h3>

            <div className="flex flex-col gap-4">
                {tools.map((tool, idx) => (
                    <motion.button
                        key={tool.id}
                        onClick={tool.action}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative group overflow-hidden rounded-xl border ${tool.border} bg-white/5 p-4 text-left transition-all hover:bg-white/10`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <div className="relative flex items-center gap-4">
                            <div className={`p-3 rounded-lg bg-black/40 ${tool.iconColor} ring-1 ring-white/10`}>
                                <tool.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white group-hover:text-white transition-colors">{tool.label}</h4>
                                <p className="text-xs text-white/50 truncate">{tool.desc}</p>
                            </div>
                            <ArrowRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Footer or extra info could go here */}
            <div className="mt-auto p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-xs text-white/40">
                    Progress is automatically saved.
                </p>
            </div>
        </div>
    );
};

export default ToolDock;
