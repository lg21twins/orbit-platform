import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Mail } from 'lucide-react';
import Magnetic from './Magnetic';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from './SEO';
import ExperienceTimeline from './ExperienceTimeline';
import ThemeToggle from './ThemeToggle';

export default function About() {
    const { t } = useLanguage();

    const skills = [
        { name: "React / Next.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Node.js", level: 75 },
        { name: "UI/UX Design", level: 80 },
        { name: "Framer Motion", level: 95 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white font-sans selection:bg-blue-500/30 transition-colors duration-300">
            <SEO title={t.about.title} description={t.about.desc1} />
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10 h-[48px] flex items-center justify-between px-6 transition-colors duration-300">
                <Link to="/" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white flex items-center transition-colors text-sm">
                    <ChevronLeft className="w-4 h-4 mr-1" /> {t.about.back_home}
                </Link>
                <ThemeToggle />
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-32 md:py-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-black dark:text-white">{t.about.title}</h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                        {t.about.desc1}
                        <br className="hidden md:block" />
                        {t.about.desc2}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-20">
                    {/* Experience Timeline */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold mb-8 text-black dark:text-white">Experience</h3>
                        <ExperienceTimeline />
                    </motion.div>

                    {/* Resume & Contact */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-10"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">{t.about.connect_title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                {t.about.connect_desc}
                            </p>
                            <div className="flex flex-col space-y-4">
                                <Magnetic>
                                    <a href="mailto:contact@example.com" className="flex items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                        <Mail className="w-5 h-5" /> <span>{t.about.send_email}</span>
                                    </a>
                                </Magnetic>
                                <Magnetic>
                                    <button className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-black dark:text-white px-6 py-4 rounded-2xl font-medium hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                                        <Download className="w-5 h-5" /> <span>{t.about.download_resume}</span>
                                    </button>
                                </Magnetic>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
