import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { useLogin, useRegister } from '../api/queries';
import { Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '', educationLevel: 'college', course: 'btech' });
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const setSession = useStore((state) => state.setSession);

    const loginMutation = useLogin();
    const registerMutation = useRegister();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let data;
            if (isLogin) {
                data = await loginMutation.mutateAsync({ email: form.email, password: form.password });
            } else {
                data = await registerMutation.mutateAsync(form);
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                setSession(data.user);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const isLoading = loginMutation.isPending || registerMutation.isPending;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Student Tracker</h1>
                    <p className="text-secondary">Your Personal Learning Operating System</p>
                </div>

                <motion.div
                    layout
                    className="bg-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                >
                    <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-secondary hover:text-white'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-secondary hover:text-white'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative mb-4">
                                        <User className="absolute left-3 top-3 text-secondary" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-secondary" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-secondary" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4 pt-2"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-primary/50"
                                        value={form.educationLevel}
                                        onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                                    >
                                        <option value="college" className="bg-[#0D1117]">College</option>
                                        <option value="school" className="bg-[#0D1117]">School</option>
                                    </select>

                                    {form.educationLevel === 'college' && (
                                        <select
                                            className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-primary/50"
                                            value={form.course}
                                            onChange={(e) => setForm({ ...form, course: e.target.value })}
                                        >
                                            <option value="btech" className="bg-[#0D1117]">B.Tech</option>
                                            <option value="other" className="bg-[#0D1117]">Other</option>
                                        </select>
                                    )}
                                </div>

                                {form.educationLevel === 'college' && (
                                    <input
                                        type="text"
                                        placeholder="Stream (e.g. CSE, ECE)"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary/50"
                                        value={form.stream || ''}
                                        onChange={(e) => setForm({ ...form, stream: e.target.value })}
                                    />
                                )}
                            </motion.div>
                        )}

                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    {isLogin ? 'Continue' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
