import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Share2, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const OrbitEventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (!id) return;
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setEvent(data);
            } catch (error) {
                console.error("Error fetching event:", error);
                // navigate('/orbit/feed'); // Optional: redirect on error
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse pointer-events-none fixed" />

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition group"
            >
                <ArrowLeft className="text-white group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <img
                    src={event.image_urls?.[0] || 'https://via.placeholder.com/1200x800'}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-80 mask-image-gradient-b"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold tracking-wider uppercase">
                            {event.type}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            {event.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-gray-300 text-sm md:text-base mt-4">
                            {event.start_date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-blue-400" size={20} />
                                    <span>
                                        {new Date(event.start_date).toLocaleDateString()}
                                        {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString()}`}
                                    </span>
                                </div>
                            )}
                            {event.location_name && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-red-400" size={20} />
                                    <span>{event.location_name}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <div className="grid grid-cols-1 gap-12">

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-invert max-w-none prose-headings:text-blue-400 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white"
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {event.description || "No description provided."}
                        </ReactMarkdown>
                    </motion.div>

                    {/* Image Gallery */}
                    {event.image_urls && event.image_urls.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.image_urls.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`Gallery ${idx + 1}`}
                                        className="rounded-xl border border-white/10 hover:scale-[1.02] transition duration-500 cursor-pointer"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-8 border-t border-white/10">
                        {event.source_url && (
                            <a
                                href={event.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                            >
                                <ExternalLink size={20} />
                                Visit Original Source
                            </a>
                        )}
                        <button className="px-6 py-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition text-white">
                            <Share2 size={24} />
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default OrbitEventDetail;
