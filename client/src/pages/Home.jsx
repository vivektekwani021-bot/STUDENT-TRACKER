import CenterpieceInput from '../components/home/CenterpieceInput';
import MemoryNodes from '../components/home/MemoryNodes';
import StreakFlame from '../components/widgets/StreakFlame';
import SmartSuggestions from '../components/widgets/SmartSuggestions';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Calendar, Briefcase, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavButton = ({ to, label, icon, color }) => (
    <Link
        to={to}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group backdrop-blur-md w-max"
    >
        <div className={`p-1.5 rounded-lg ${color}/20 text-${color.split('-')[1]}-400 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
            {label}
        </span>
    </Link>
);

const Home = () => {
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background">

            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D1117]/80 to-[#161B22] pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

            {/* Interactive Elements */}
            <MemoryNodes />

            <div className="z-10 w-full px-4 max-w-4xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-4 tracking-tight drop-shadow-2xl">
                        Student Tracker
                    </h1>
                    <p className="text-secondary text-lg md:text-xl font-light">
                        Your Personal Learning Operating System
                    </p>
                </motion.div>

                <CenterpieceInput />
            </div>

            {/* Widgets */}
            <div className="absolute top-6 right-6 z-20">
                <StreakFlame streak={12} />
            </div>

            <div className="absolute bottom-6 right-6 z-20">
                <SmartSuggestions />
            </div>

            {/* Footer Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 text-white/20 text-sm font-light tracking-widest uppercase"
            >
                Design your knowledge
            </motion.div>
        </div>
    );
};

export default Home;
