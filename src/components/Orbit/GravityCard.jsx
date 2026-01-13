import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckCircle, AlertCircle, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const GravityCard = ({ event, delay = 0 }) => {
    const { id, title, type, location_name, verification_level, image_urls } = event;
    const navigate = useNavigate();

    // Floating animation variants
    const floatVariants = {
        animate: {
            y: [0, -15, 0],
            rotate: [0, 1, -1, 0],
            transition: {
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }
        }
    };

    const getBadgeColor = (level) => {
        switch (level) {
            case 1: return "bg-green-500/20 text-green-400 border-green-500/50"; // Verified
            case 2: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"; // Probable
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"; // Testing
        }
    };

    const getBadgeIcon = (level) => {
        switch (level) {
            case 1: return <CheckCircle size={14} className="mr-1" />;
            case 2: return <AlertCircle size={14} className="mr-1" />;
            default: return <Clock size={14} className="mr-1" />;
        }
    };

    return (
        <motion.div
            variants={floatVariants}
            animate="animate"
            whileHover={{ scale: 1.05, zIndex: 10 }}
            onClick={() => navigate(`/orbit/event/${id}`)}
            className="relative w-64 h-80 rounded-2xl overflow-hidden backdrop-blur-md bg-black/40 border border-white/10 shadow-xl group cursor-pointer"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={image_urls?.[0] || 'https://via.placeholder.com/300x400'}
                    alt={title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                {/* Verification Badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium border flex items-center ${getBadgeColor(verification_level)}`}>
                    {getBadgeIcon(verification_level)}
                    {verification_level === 1 ? 'Official' : verification_level === 2 ? 'Probable' : 'Testing'}
                </div>

                {/* Type Tag */}
                <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase mb-2 block">
                    {type}
                </span>

                <h3 className="text-white text-lg font-bold leading-tight mb-2 line-clamp-2">
                    {title}
                </h3>

                <div className="text-gray-300 text-xs space-y-1 mb-3">
                    {location_name && (
                        <div className="flex items-center">
                            <MapPin size={12} className="mr-1.5" />
                            {location_name}
                        </div>
                    )}
                    <div className="flex items-center">
                        <Calendar size={12} className="mr-1.5" />
                        {event.start_date ? (
                            <span>
                                {new Date(event.start_date).toLocaleDateString()}
                                {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString()}`}
                            </span>
                        ) : (
                            <span>Coming Soon</span>
                        )}
                    </div>
                </div>

                {/* Verification Voting UI */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Is this real?</span>
                    <div className="flex space-x-2">
                        <button className="p-1 rounded-full bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition">
                            <ThumbsUp size={14} />
                        </button>
                        <button className="p-1 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition">
                            <ThumbsDown size={14} />
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default GravityCard;
