import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Share2 } from 'lucide-react';
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
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // Helper to calculate status
    const getStatus = (end) => {
        if (!end) return null;
        const today = new Date();
        const endDate = new Date(end);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { label: 'ENDED', color: 'bg-gray-600' };
        if (diffDays === 0) return { label: 'D-DAY', color: 'bg-red-600' };
        return { label: `D-${diffDays}`, color: 'bg-blue-600' };
    };

    if (loading) return <div className="min-h-screen bg-black flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" /></div>;
    if (!event) return null;

    const status = getStatus(event.end_date);

    return (
        <div className="min-h-screen bg-black text-white font-sans relative pb-20">
            {/* Back Nav */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition group"
                >
                    <ArrowLeft className="text-white" />
                </button>
            </div>

            {/* Hero Image */}
            <div className="relative h-[50vh] w-full">
                <img
                    src={event.image_urls?.[0] || 'https://via.placeholder.com/1200x800'}
                    alt={event.title}
                    className="w-full h-full object-cover mask-image-gradient-b opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold tracking-wider uppercase text-blue-300">
                                {event.type}
                            </span>
                            {status && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-white ${status.color}`}>
                                    {status.label}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-xl">
                            {event.title}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Left Column: Key Info (Sticky on desktop) */}
                <div className="md:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl"
                    >
                        {/* Status Block */}
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Period</p>
                            <div className="flex items-start gap-3">
                                <Calendar className="text-blue-400 shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="font-bold text-lg">{new Date(event.start_date).toLocaleDateString()}</p>
                                    {event.end_date && (
                                        <p className="text-gray-400 text-sm">~ {new Date(event.end_date).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-px bg-white/10" />
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Location</p>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-red-400 shrink-0 mt-1" size={20} />
                                <p className="font-medium text-gray-200">{event.location_name || 'Animate Korea'}</p>
                            </div>
                        </div>

                        {event.source_url && (
                            <a
                                href={event.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full text-center bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition mt-4"
                            >
                                Visit Website
                            </a>
                        )}
                    </motion.div>
                </div>

                {/* Right Column: Descriptions & Gallery */}
                <div className="md:col-span-2 space-y-10">

                    {/* Markdown Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-invert prose-lg max-w-none 
                            prose-headings:text-blue-200 prose-headings:font-bold prose-headings:border-l-4 prose-headings:border-blue-500 prose-headings:pl-4
                            prose-p:text-gray-300 prose-p:leading-relaxed
                            prose-strong:text-white prose-strong:font-extrabold
                            prose-ul:list-disc prose-ul:pl-4 prose-li:text-gray-300
                            prose-blockquote:bg-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-400 prose-blockquote:not-italic"
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {event.description || "No description provided."}
                        </ReactMarkdown>
                    </motion.div>

                    {/* Gallery */}
                    {event.image_urls && event.image_urls.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full" />
                                Gallery
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {event.image_urls.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`Gallery ${idx + 1}`}
                                        className="rounded-xl border border-white/5 hover:scale-[1.02] transition duration-500 cursor-pointer w-full object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrbitEventDetail;
