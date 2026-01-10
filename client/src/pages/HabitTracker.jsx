import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHabits, useCreateHabit, useMarkHabit } from '../api/queries';
import { Plus, Check, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HabitTracker = () => {
    const navigate = useNavigate();
    const { data: habits, isLoading } = useHabits();
    const createHabit = useCreateHabit();
    const markHabit = useMarkHabit();

    const [isCreating, setIsCreating] = useState(false);
    const [newHabit, setNewHabit] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newHabit.trim()) return;
        await createHabit.mutateAsync({ title: newHabit, reminderTime: '09:00' });
        setNewHabit('');
        setIsCreating(false);
    };

    const isCompletedToday = (habit) => {
        const today = new Date().toDateString();
        return habit.completedDates.some(d => new Date(d).toDateString() === today);
    };

    return (
        <div className="min-h-screen bg-background text-white p-6 font-sans pb-32">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-full hover:bg-white/10 text-secondary hover:text-white transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-bold">Habit Tracker</h1>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="p-3 bg-primary text-black rounded-xl hover:bg-white transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </header>

                {/* Create Form */}
                {isCreating && (
                    <motion.form
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleCreate}
                        className="mb-8 p-4 bg-surface/20 rounded-xl border border-white/10 flex gap-4"
                    >
                        <input
                            type="text"
                            className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary/50"
                            placeholder="New habit name..."
                            value={newHabit}
                            onChange={(e) => setNewHabit(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="bg-primary px-6 py-2 rounded-lg text-black font-semibold">
                            Add
                        </button>
                    </motion.form>
                )}

                {isLoading ? (
                    <div className="text-center text-secondary py-10">Loading habits...</div>
                ) : (
                    <div className="grid gap-4">
                        {habits?.length === 0 && (
                            <div className="text-center text-secondary py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                No habits yet. Start a new streak today!
                            </div>
                        )}
                        {habits?.map(habit => {
                            const done = isCompletedToday(habit);
                            return (
                                <motion.div
                                    key={habit._id}
                                    layout
                                    className={`p-6 rounded-xl border ${done ? 'bg-green-500/10 border-green-500/30' : 'bg-surface/10 border-white/5'} flex items-center justify-between transition-all`}
                                >
                                    <div>
                                        <h3 className={`text-xl font-medium ${done ? 'text-green-400' : 'text-white'}`}>{habit.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                Streak: {habit.streak} days
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => markHabit.mutate({ id: habit._id, date: new Date().toISOString() })}
                                        className={`p-4 rounded-full transition-all ${done ? 'bg-green-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                        <Check size={24} />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitTracker;
