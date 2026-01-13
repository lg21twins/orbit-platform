import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GravityCard from '../../components/Orbit/GravityCard';
import { Search, HelpCircle, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_EVENTS } from '../../data/mockOrbitData';
import { useLanguage } from '../../contexts/LanguageContext';

const OrbitLanding = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const { t, lang, toggleLang } = useLanguage();
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse" />

            {/* Floating Header */}
            <div className="absolute top-10 w-full flex justify-between items-center px-10 z-20">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tighter cursor-pointer" onClick={() => navigate('/orbit')}>
                    {t.orbit.title}
                </h1>
                <div className="flex items-center space-x-4">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLang}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur transition border border-white/10 flex items-center gap-2"
                    >
                        <Globe size={14} />
                        {lang === 'ko' ? 'EN' : 'KO'}
                    </button>

                    {/* Help Button */}
                    <button
                        onClick={() => setShowHelp(true)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition"
                    >
                        <HelpCircle size={20} />
                    </button>

                    {/* Search / Enter Feed */}
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition" onClick={() => navigate('/orbit/feed')}>
                        <Search size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-purple-500/50 border border-purple-400" />
                </div>
            </div>

            {/* Main Content - Floating Grid */}
            <div className="relative w-full max-w-6xl h-[80vh] mx-auto z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10 items-center justify-center">
                {MOCK_EVENTS.map((event, index) => (
                    <div key={event.id} className={`${index % 2 === 0 ? 'mt-10' : '-mt-10'} flex justify-center`}>
                        <GravityCard event={event} delay={index * 0.2} />
                    </div>
                ))}
            </div>

            {/* Interaction Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/40 text-sm tracking-widest uppercase cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate('/orbit/feed')}
            >
                {t.orbit.enter_feed}
            </motion.div>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowHelp(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowHelp(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                                {t.orbit.help.title}
                            </h2>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {t.orbit.help.desc}
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-white bg-white/5 p-3 rounded-lg border border-white/5">
                                    {t.orbit.help.feature1}
                                </li>
                                <li className="flex items-center text-white bg-white/5 p-3 rounded-lg border border-white/5">
                                    {t.orbit.help.feature2}
                                </li>
                            </ul>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:opacity-90 transition"
                            >
                                {t.orbit.help.close}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default OrbitLanding;
