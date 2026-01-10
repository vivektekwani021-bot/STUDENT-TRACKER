import { ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reflection = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            >
                <ArrowLeft size={24} className="text-secondary hover:text-white" />
            </button>

            <div className="max-w-2xl text-center z-10 space-y-8">
                <div className="inline-block p-4 rounded-full bg-white/5 mb-4 backdrop-blur-md">
                    <TrendingUp size={48} className="text-primary" />
                </div>

                <h1 className="text-5xl font-display font-bold">Your Growth Journey</h1>

                <p className="text-secondary text-xl font-light leading-relaxed">
                    "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence."
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <Clock className="text-secondary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                        <p className="text-sm text-secondary">Visualize your learning consistency over time.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="w-6 h-6 rounded-full border-2 border-red-400/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Weak Spots</h3>
                        <p className="text-sm text-secondary">Target areas that need reinforcement.</p>
                    </div>
                </div>

                <div className="pt-8">
                    <span className="px-4 py-2 rounded-full bg-white/5 text-xs font-mono uppercase tracking-widest text-secondary">
                        Feature Coming Soon
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Reflection;
