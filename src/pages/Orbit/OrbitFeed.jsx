import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Compass, HelpCircle, X, Globe } from 'lucide-react';
import GravityCard from '../../components/Orbit/GravityCard';
import { supabase } from '../../lib/supabase';

import { MOCK_EVENTS } from '../../data/mockOrbitData';
import { useLanguage } from '../../contexts/LanguageContext';

const OrbitFeed = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, POPUP, CAFE, GOODS
    const { t, lang, toggleLang } = useLanguage();
    const [showHelp, setShowHelp] = useState(false);

    // Fetch data from Supabase
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);

            // Check if supabase is configured
            if (!supabase) {
                console.warn("Supabase client not initialized, using mock data");
                setEvents(MOCK_EVENTS);
                setLoading(false);
                return;
            }

            let query = supabase.from('events').select('*');

            if (filter !== 'ALL') {
                query = query.eq('type', filter);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data && data.length > 0) {
                setEvents(data);
            } else {
                // Fallback to empty state or handle accordingly
                // For prototype, if DB is empty, show MOCK data
                console.log("No data from DB, using mock data");
                setEvents(MOCK_EVENTS);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents(MOCK_EVENTS); // Fallback on error
        } finally {
            setLoading(false);
        }
    };

    // Handler for filter change
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        // In a real app, you might want to refetch or filter locally
        // For now, let's just refetch to demonstrate DB interaction
        // Optimization: filter local 'events' state if we already fetched everything
    };

    // Effect to refetch when filter changes (if we want server-side filtering)
    useEffect(() => {
        fetchEvents();
    }, [filter]);


    return (
        <div className="min-h-screen bg-black overflow-hidden font-sans relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse pointer-events-none" />

            <div className="relative z-10 p-6 pt-24">
                {/* Header controls */}
                <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 mb-2">
                            {t.orbit.title} FEED
                        </h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <Compass size={16} />
                            {t.orbit.subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
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
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition mr-4"
                        >
                            <HelpCircle size={20} />
                        </button>

                        {/* Filters */}
                        <div className="flex bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/10">
                            {['all', 'popup', 'cafe', 'goods'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => handleFilterChange(f.toUpperCase())}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === f.toUpperCase()
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {t.orbit.filters[f]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl">
                            <p className="text-gray-500 text-xl">No signals detected in this sector.</p>
                            <p className="text-gray-600 text-sm mt-2">Try adjusting your filters or checking back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {events.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {/* Reusing GravityCard but maybe with less float for readability in grid?
                    For now, keeping the float effect as it's the signature style.
                */}
                                    <GravityCard event={event} delay={index * 0.1} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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

export default OrbitFeed;
