import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import VideoStack from '../components/room/VideoStack';
import AINarrative from '../components/room/AINarrative';
import ToolDock from '../components/room/ToolDock';
import { ArrowLeft, Sparkles, Youtube, Share2, MoreVertical, Menu } from 'lucide-react';
import { useGenerateContent, useMarkLearned, useDownloadNotes } from '../api/queries';

const LearningRoom = () => {
    const navigate = useNavigate();
    const currentTopic = useStore((state) => state.currentTopic);
    const setMode = useStore((state) => state.setMode);

    const generateContent = useGenerateContent();
    const markLearned = useMarkLearned();

    const [pageContent, setPageContent] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!currentTopic) {
            navigate('/');
            return;
        }

        // Fetch content if not already available
        if (!pageContent && !generateContent.isPending) {
            generateContent.mutateAsync({ topic: currentTopic, prompt: "Explain like I am an advanced student, but clear." })
                .then(data => {
                    const rawText = data.explanation || "No explanation generated.";

                    const textChunks = rawText.split('\n\n').map(c => {
                        const trimmed = c.trim();
                        if (trimmed.startsWith('```')) {
                            const lines = trimmed.split('\n');
                            const lang = lines[0].replace(/```/g, '') || 'javascript';
                            const code = lines.slice(1, -1).join('\n');
                            return { type: 'code', language: lang, content: code };
                        } else if (trimmed.startsWith('#')) {
                            return { type: 'heading', content: trimmed.replace(/^#+\s/, '') };
                        }
                        return { type: 'text', content: trimmed };
                    });

                    setPageContent({
                        chunks: textChunks,
                        videos: data.videos
                    });
                })
                .catch(err => {
                    console.error("Failed to generate content:", err);
                });
        }
    }, [currentTopic, navigate]);

    const handleChallenge = () => {
        setMode('challenge');
        navigate('/challenge');
    };

    const handleMarkLearned = async () => {
        await markLearned.mutateAsync({
            topicName: currentTopic,
            quizScore: 85, // Mock score for "I understand this"
            studyTime: 15
        });
        navigate('/');
    };

    const downloadNotes = useDownloadNotes();

    const handleDownload = () => {
        if (!currentTopic) return;

        // Add specific visual feedback here if desired (e.g. toast)
        console.log('Generating PDF...');

        downloadNotes.mutateAsync({
            topic: currentTopic,
            prompt: "Comprehensive study notes with key concepts and examples."
        })
            .then((blob) => {
                // Create a link to download the blob
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Notes-${currentTopic}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(err => {
                console.error("Failed to download notes:", err);
                // Handle error (e.g. toast)
            });
    };

    if (!currentTopic) return null;

    return (
        <div className="h-screen w-full bg-background text-white overflow-hidden flex flex-col font-sans selection:bg-primary/30">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 z-20 border-b border-white/5 bg-surface/10 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -ml-2 rounded-full text-secondary hover:text-white hover:bg-white/5 transition-all group"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-white/90">
                                {currentTopic}
                            </h1>
                            <div className="flex items-center gap-1.5 ">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary">Live Session</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-secondary hover:text-white transition-colors">
                        <Share2 size={18} />
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button className="p-2 text-secondary hover:text-white transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 flex overflow-hidden relative z-10">

                {/* Left: Video Context (Collapsible) */}
                <motion.aside
                    initial={{ width: 320, opacity: 0 }}
                    animate={{ width: isSidebarOpen ? 380 : 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="h-full border-r border-white/5 bg-[#0A0A12]/50 backdrop-blur-lg flex flex-col overflow-hidden hidden lg:flex"
                >
                    <div className="p-6 h-full min-w-[380px]">
                        <VideoStack videos={pageContent?.videos} />
                    </div>
                </motion.aside>

                {/* Mobile Sidebar Toggle (Visible only if needed, logic for mobile can be added) */}

                {/* Center: Content Stream */}
                <section className="flex-1 h-full min-w-0 bg-transparent flex flex-col relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

                    {generateContent.isPending ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-8">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-surface/20 backdrop-blur-md relative z-10">
                                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                                </div>
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-medium text-white">Synthesizing Knowledge...</h3>
                                <p className="text-secondary text-sm max-w-xs mx-auto">Curating the perfect explanation and finding relevant videos for you.</p>
                            </div>
                        </div>
                    ) : (
                        <AINarrative content={pageContent} />
                    )}
                </section>

                {/* Right: Actions (Dock) */}
                <aside className="w-80 h-full border-l border-white/5 bg-[#0A0A12]/30 backdrop-blur-md hidden xl:flex flex-col">
                    <ToolDock
                        onChallenge={handleChallenge}
                        onMarkLearned={handleMarkLearned}
                        onDownloadNotes={handleDownload}
                    />
                </aside>
            </main>
        </div>
    );
};

export default LearningRoom;
