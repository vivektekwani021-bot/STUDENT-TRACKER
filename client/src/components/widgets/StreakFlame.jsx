import { Flame } from 'lucide-react';

const StreakFlame = ({ streak = 3 }) => {
    // Hardcoded streak for demo if not passed
    return (
        <div className="flex items-center gap-2 group cursor-pointer" title={`${streak} day streak`}>
            <div className={`relative p-2 rounded-full transition-all duration-500 ${streak > 0 ? 'bg-orange-500/10' : 'bg-white/5'}`}>
                <Flame
                    size={24}
                    className={`transition-colors duration-500 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-500'}`}
                />
                {streak > 0 && (
                    <div className="absolute inset-0 bg-orange-500/20 blur-[10px] rounded-full animate-pulse pointer-events-none" />
                )}
            </div>
            <div className="flex flex-col">
                <span className={`text-sm font-bold ${streak > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
                    {streak}
                </span>
                <span className="text-[10px] text-secondary uppercase tracking-wider">Day Streak</span>
            </div>
        </div>
    );
};

export default StreakFlame;
