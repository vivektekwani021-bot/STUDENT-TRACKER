import { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { useMarkSchoolAttendance, useMarkSubjectAttendance, useGetAttendance } from '../api/queries';
import { Calendar, CheckCircle, XCircle, BookOpen, School, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
    const session = useStore((state) => state.session);
    const navigate = useNavigate();
    const isCollege = session?.educationLevel === 'college';

    const markSchool = useMarkSchoolAttendance();
    const markSubject = useMarkSubjectAttendance();

    // Mock subjects if not fetched (Ideally fetch from backend or session)
    // For now we allow user to type or select from a preset list
    const defaultSubjects = ['Mathematics', 'Physics', 'Computer Science', 'Electronics', 'Humanities'];
    const [selectedSubject, setSelectedSubject] = useState(defaultSubjects[0]);

    const handleMarkSchool = async (isPresent) => {
        try {
            await markSchool.mutateAsync({
                isPresent,
                date: new Date().toISOString()
            });
            alert(`Marked as ${isPresent ? 'Present' : 'Absent'}`);
        } catch (err) {
            console.error(err);
            alert("Failed to mark attendance");
        }
    };

    const handleMarkSubject = async (isPresent) => {
        if (!selectedSubject) return;
        try {
            await markSubject.mutateAsync({
                subjectName: selectedSubject,
                isPresent,
                date: new Date().toISOString()
            });
            alert(`Marked ${selectedSubject} as ${isPresent ? 'Present' : 'Absent'}`);
        } catch (err) {
            console.error(err);
            alert("Failed to mark subject attendance");
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-full hover:bg-white/10 text-secondary hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            {isCollege ? <BookOpen className="text-primary" /> : <School className="text-primary" />}
                            Attendance Tracker
                        </h1>
                        <p className="text-secondary text-sm mt-1">
                            {isCollege ? 'Track your subject-wise totals' : 'Monitor your daily school streaks'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Action Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                    >
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Calendar className="text-blue-400" size={20} />
                            Mark for Today
                        </h2>

                        {isCollege ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm text-secondary block mb-2">Select Subject</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                    >
                                        {defaultSubjects.map(sub => (
                                            <option key={sub} value={sub} className="bg-[#0D1117]">{sub}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleMarkSubject(true)}
                                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group"
                                    >
                                        <CheckCircle size={32} className="text-green-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-semibold text-green-400">Present</span>
                                    </button>
                                    <button
                                        onClick={() => handleMarkSubject(false)}
                                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group"
                                    >
                                        <XCircle size={32} className="text-red-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-semibold text-red-400">Absent</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                                    <p className="text-primary font-medium">Daily School Attendance</p>
                                    <p className="text-xs text-primary/60 mt-1">Keep your streak alive!</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleMarkSchool(true)}
                                        className="flex flex-col items-center gap-2 p-6 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group"
                                    >
                                        <CheckCircle size={40} className="text-green-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-semibold text-green-400">Present</span>
                                    </button>
                                    <button
                                        onClick={() => handleMarkSchool(false)}
                                        className="flex flex-col items-center gap-2 p-6 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group"
                                    >
                                        <XCircle size={40} className="text-red-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-semibold text-red-400">Absent</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Stats Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center opacity-70"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <TrendingUp size={24} className="text-white/50" />
                        </div>
                        <h3 className="text-lg font-medium text-white/80">Statistics Unavailable</h3>
                        <p className="text-secondary text-sm mt-2 max-w-xs">
                            Detailed charts and history are coming soon. Your data is being safely recorded.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
