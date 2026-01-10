import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Youtube, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const VideoStack = ({ videos = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // If videos are empty, we might want to show placeholders or nothing.
    // Assuming backend always returns something or we handle empty state.
    const displayVideos = videos.length > 0 ? videos : [];

    if (displayVideos.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-surface/20 rounded-2xl border border-white/5 backdrop-blur-sm">
                <Youtube className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-secondary text-sm">No related videos found.</p>
            </div>
        );
    }

    const activeVideo = displayVideos[activeIndex];

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex items-center gap-2 pl-1">
                <div className="p-1.5 bg-red-500/20 rounded-md">
                    <Youtube size={14} className="text-red-500" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary">Recommended Videos</h3>
            </div>

            {/* Active Player */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl relative group">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=0&rel=0&modestbranding=1`}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                ></iframe>
            </div>

            {/* Video List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {displayVideos.map((video, idx) => (
                    <motion.div
                        key={video.videoId || idx}
                        onClick={() => setActiveIndex(idx)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group flex gap-3 ${activeIndex === idx
                                ? 'bg-white/10 border-primary/50 shadow-lg shadow-primary/5'
                                : 'bg-surface/30 border-transparent hover:border-white/10 hover:bg-white/5'
                            }`}
                    >
                        {/* Thumbnail / Number */}
                        <div className={`relative w-24 h-16 shrink-0 rounded-md overflow-hidden bg-black/50 border border-white/5 flex items-center justify-center ${activeIndex === idx ? 'ring-2 ring-primary/20' : ''}`}>
                            <img
                                src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                onError={(e) => { e.target.style.display = 'none'; }}
                                alt="thumbnail"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                            <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md ${activeIndex === idx ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}>
                                {activeIndex === idx ? <Play size={10} fill="currentColor" /> : <span className="text-xs font-mono">{idx + 1}</span>}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-center min-w-0">
                            <h4 className={`text-sm font-medium leading-snug line-clamp-2 ${activeIndex === idx ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                {video.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-[10px] uppercase tracking-wider ${activeIndex === idx ? 'text-primary' : 'text-gray-600'}`}>
                                    {video.channel || 'YouTube'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default VideoStack;
