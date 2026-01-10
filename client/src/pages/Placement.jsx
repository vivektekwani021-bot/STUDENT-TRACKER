import { motion } from 'framer-motion';
import { usePlacements, useApplyPlacement } from '../api/queries';
import { Briefcase, Building, DollarSign, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const Placement = () => {
    const navigate = useNavigate();
    const session = useStore((state) => state.session);
    const { data: placements, isLoading, error } = usePlacements();
    const apply = useApplyPlacement();

    const canAccess = session?.educationLevel === 'college' && session?.course === 'btech';

    // Although backend protects the route, we show a friendly UI message too
    if (!canAccess) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#050510] text-white p-6 text-center relative overflow-hidden">
                {/* Background decoration to look less "broken" */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]" />

                <div className="relative z-10 bg-surface/20 border border-white/10 p-8 rounded-2xl max-w-lg backdrop-blur-md">
                    <Briefcase size={64} className="text-secondary mb-6 mx-auto" />
                    <h1 className="text-2xl font-bold mb-3">Placement Portal Locked</h1>

                    <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-secondary mb-2">Access Restrictions:</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className={session?.educationLevel === 'college' ? "text-green-400" : "text-red-400"}>
                                    {session?.educationLevel === 'college' ? "✓" : "✕"}
                                </span>
                                <span className="text-white/80">College Student</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={session?.course === 'btech' ? "text-green-400" : "text-red-400"}>
                                    {session?.course === 'btech' ? "✓" : "✕"}
                                </span>
                                <span className="text-white/80">Enrolled in B.Tech</span>
                            </li>
                        </ul>
                    </div>

                    <p className="text-secondary text-sm mb-6">
                        This module is exclusively for final year B.Tech students to manage their campus placements.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-full hover:bg-white/10 text-secondary hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">Placement Opportunities</h1>
                        <p className="text-secondary">Apply to top companies visiting campus</p>
                    </div>
                </header>

                {error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                        {error.response?.data?.message || "Failed to load placements. Access Denied."}
                    </div>
                ) : isLoading ? (
                    <div className="text-center text-secondary py-10">Loading opportunities...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {placements?.map((job) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={job._id}
                                className="bg-surface/10 border border-white/5 rounded-2xl p-6 hover:bg-surface/20 transition-colors relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Briefcase size={100} />
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Building size={24} className="text-white" />
                                    </div>
                                    <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-secondary">
                                        FULL TIME
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{job.role}</h3>
                                <p className="text-secondary mb-4">{job.companyName}</p>

                                <div className="flex items-center gap-2 mb-6 text-sm">
                                    <span className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded">
                                        <DollarSign size={14} />
                                        {job.package}
                                    </span>
                                    <span className="text-secondary">•</span>
                                    <span className="text-secondary">{new Date(job.deadline).toLocaleDateString()}</span>
                                </div>

                                {job.applicants.includes(session.id) ? (
                                    <button disabled className="w-full py-2 rounded-xl bg-green-500/20 text-green-500 font-medium border border-green-500/20">
                                        Applied Successfully
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => apply.mutate(job._id)}
                                        className="w-full py-2 rounded-xl bg-white text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Placement;
