import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Home,
    CheckSquare,
    Calendar,
    Briefcase,
    Trophy,
    UserCircle
} from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    // Hide on Auth page
    if (location.pathname === '/auth') return null;

    const navItems = [
        { path: '/', icon: <Home size={20} />, label: 'Home' },
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/learn', icon: <UserCircle size={20} />, label: 'Zone' },
        { path: '/habits', icon: <CheckSquare size={20} />, label: 'Habits' },
        { path: '/attendance', icon: <Calendar size={20} />, label: 'Attendance' },
        { path: '/placement', icon: <Briefcase size={20} />, label: 'Jobs' },
        { path: '/challenge', icon: <Trophy size={20} />, label: 'Challenge' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.2, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-3 rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-primary text-white shadow-[0_0_20px_rgba(112,0,255,0.5)]'
                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {item.icon}
                            </motion.div>

                            {/* Hover Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default Navbar;
