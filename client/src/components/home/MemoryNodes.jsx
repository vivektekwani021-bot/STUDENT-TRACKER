import { motion } from 'framer-motion';
import { useLearningHistory } from '../../api/queries';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const MemoryNodes = () => {
    const { data: history } = useLearningHistory();
    const setMode = useStore((state) => state.setMode);
    const setCurrentTopic = useStore((state) => state.setCurrentTopic);
    const navigate = useNavigate();

    // Fallback data
    const nodes = history?.length > 0 ? history : [
        { id: 1, topic: "Linked Lists", mastery: 40 },
        { id: 2, topic: "React Hooks", mastery: 90 },
        { id: 3, topic: "Async/Await", mastery: 60 },
        { id: 4, topic: "Flexbox", mastery: 75 },
        { id: 5, topic: "Docker Basics", mastery: 30 },
        { id: 6, topic: "SQL Joins", mastery: 50 },
    ];

    const handleNodeClick = (topic) => {
        setCurrentTopic(topic);
        setMode('learning');
        navigate('/learn');
    };

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {nodes.map((node, i) => (
                <Node key={i} topic={node.topicName || node.topic} index={i} onClick={() => handleNodeClick(node.topicName || node.topic)} />
            ))}
        </div>
    );
};

const Node = ({ topic, index, onClick }) => {
    // Generate safe random positions (avoiding center)
    // Divide screen into grid or sectors.
    // Simple approach: Random angle and radius > centerThreshold

    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 25; // 25% to 50% from center
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;

    const duration = 25 + Math.random() * 15;
    const delay = Math.random() * 5;

    return (
        <motion.div
            onClick={onClick}
            className="absolute px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/5 text-white/30 text-sm font-medium whitespace-nowrap cursor-pointer hover:bg-white/10 hover:text-primary hover:border-primary/30 hover:shadow-[0_0_15px_rgba(88,166,255,0.2)] transition-all duration-300"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: 1,
                x: [0, Math.random() * 40 - 20, 0],
                y: [0, Math.random() * 40 - 20, 0]
            }}
            style={{ left: `${x}%`, top: `${y}%` }}
            transition={{
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                x: { duration: duration, repeat: Infinity, ease: "easeInOut" },
                y: { duration: duration, repeat: Infinity, ease: "easeInOut", delay: -5 },
            }}
        >
            {topic}
        </motion.div>
    );
};

export default MemoryNodes;
