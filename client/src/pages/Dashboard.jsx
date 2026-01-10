import { motion } from 'framer-motion';
import { useUser, useLearningHistory, useWeakTopics } from '../api/queries';
import {
    LayoutDashboard,
    BookOpen,
    Target,
    Clock,
    Trophy,
    Activity,
    ArrowLeft,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const { data: user, isLoading } = useUser();
    const { data: history } = useLearningHistory();
    const { data: weakTopics } = useWeakTopics();

    // Calculate Stats
    const totalTopics = history?.length || 0;
    const averageScore = history?.reduce((acc, curr) => acc + (curr.quizScore || 0), 0) / (totalTopics || 1);
    const masteryCount = history?.filter(h => h.masteryStatus === 'Strong').length || 0;

    // Prepare Chart Data (Last 10 quizzes)
    const chartData = history?.slice(-10).map((h, i) => ({
        name: `Quiz ${i + 1}`,
        score: h.quizScore
    })) || [];

    if (isLoading) {
        return <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-full hover:bg-white/10 text-secondary hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <LayoutDashboard className="text-primary" />
                            Student Dashboard
                        </h1>
                        <p className="text-secondary">Welcome back, {user?.name}</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<BookOpen size={24} className="text-blue-400" />}
                        label="Topics Learned"
                        value={totalTopics}
                        subValue="+2 this week"
                    />
                    <StatCard
                        icon={<Target size={24} className="text-green-400" />}
                        label="Average Accuracy"
                        value={`${Math.round(averageScore)}%`}
                        subValue="Top 10% of students"
                    />
                    <StatCard
                        icon={<Trophy size={24} className="text-yellow-400" />}
                        label="Mastered Topics"
                        value={masteryCount}
                        subValue="Keep it up!"
                    />
                    <StatCard
                        icon={<Clock size={24} className="text-purple-400" />}
                        label="Study Time"
                        value={`${Math.round((user?.totalStudyTime || 0) / 60)}h`} // Assuming totalStudyTime is in mins
                        subValue="Total hours"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Performance Chart & History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chart Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface/20 border border-white/5 rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-primary" />
                                Performance Trend
                            </h2>
                            <div className="h-[300px] w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <XAxis dataKey="name" stroke="#ffffff30" tick={false} />
                                            <YAxis stroke="#ffffff30" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #ffffff10' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Line type="monotone" dataKey="score" stroke="#00f2fe" strokeWidth={3} dot={{ fill: '#00f2fe' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-secondary">
                                        No quiz data available yet.
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Recent History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-surface/20 border border-white/5 rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4">Recent Learning History</h2>
                            <div className="space-y-3">
                                {history?.slice().reverse().slice(0, 5).map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <div>
                                            <h4 className="font-medium text-white">{item.topicName}</h4>
                                            <p className="text-xs text-secondary">{new Date(item.completedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm px-2 py-1 rounded ${item.masteryStatus === 'Strong' ? 'bg-green-500/20 text-green-400' :
                                                    item.masteryStatus === 'Weak' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {item.masteryStatus}
                                            </span>
                                            <span className="font-bold text-white/80">{item.quizScore}%</span>
                                        </div>
                                    </div>
                                ))}
                                {(!history || history.length === 0) && (
                                    <p className="text-secondary text-center py-4">No topics learned yet.</p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar - Weak Topics & Quick Actions */}
                    <div className="space-y-6">
                        {/* Weak Topics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
                                <AlertCircle size={20} />
                                Focus Areas
                            </h2>
                            <p className="text-sm text-secondary mb-4">Topics you found difficult:</p>
                            <div className="flex flex-wrap gap-2">
                                {weakTopics?.map((topic, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-red-500/10 text-red-300 rounded-full text-sm border border-red-500/20">
                                        {topic}
                                    </span>
                                ))}
                                {(!weakTopics || weakTopics.length === 0) && (
                                    <p className="text-secondary text-sm italic">Great job! No weak topics identified.</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-surface/20 border border-white/5 rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp size={20} className="text-secondary" />
                                Course Info
                            </h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between p-2 rounded bg-white/5">
                                    <span className="text-secondary">Level</span>
                                    <span className="text-white font-medium capitalize">{user?.educationLevel}</span>
                                </div>
                                <div className="flex justify-between p-2 rounded bg-white/5">
                                    <span className="text-secondary">Course</span>
                                    <span className="text-white font-medium capitalize">{user?.course}</span>
                                </div>
                                {user?.stream && (
                                    <div className="flex justify-between p-2 rounded bg-white/5">
                                        <span className="text-secondary">Stream</span>
                                        <span className="text-white font-medium capitalize">{user?.stream}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, subValue }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface/20 border border-white/5 rounded-2xl p-6 hover:bg-surface/30 transition-colors"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-white/5">
                {icon}
            </div>
            {/* <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                +12%
            </span> */}
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-secondary font-medium">{label}</p>
        <p className="text-xs text-white/40 mt-2">{subValue}</p>
    </motion.div>
);

export default Dashboard;
