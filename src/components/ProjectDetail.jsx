import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Github } from 'lucide-react';
import Magnetic from './Magnetic';
import { useLanguage } from '../contexts/LanguageContext';
import { projectsData } from '../data/projects';
import SEO from './SEO';
import ScrollProgress from './ScrollProgress';
import ThemeToggle from './ThemeToggle';

export default function ProjectDetail() {
    const { id } = useParams();
    const { lang, t } = useLanguage();

    // Select data based on language (fallback to ko if something is wrong, or en)
    const projectBase = projectsData[id] || projectsData["portfolio"];
    const project = projectBase[lang] || projectBase['en'];

    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);

    // Split stack if it's an array, otherwise use as is
    const stack = Array.isArray(project.stack) ? project.stack : [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white font-sans selection:bg-blue-500/30 transition-colors duration-300">
            <ScrollProgress />
            <SEO title={project.title} description={project.slogan} />
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10 h-[48px] flex items-center justify-between px-6 transition-colors duration-300">
                <Link to="/" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white flex items-center transition-colors text-sm">
                    <ChevronLeft className="w-4 h-4 mr-1" /> {t.project.back_home}
                </Link>
                <ThemeToggle />
            </nav>

            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">

                {/* Visual Background (Placeholder for Image/Video) */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-gray-50 dark:from-black/80 dark:via-black/70 dark:to-black z-10" />
                    {/* Placeholder for actual image/video */}
                    <motion.div
                        style={{ scale: opacity }}
                        className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
                    />
                </div>

                <motion.div style={{ opacity }} className="text-center max-w-4xl mx-auto relative z-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-3xl font-semibold text-blue-600 dark:text-blue-500 mb-4 tracking-wide"
                    >
                        {t.project.analysis}
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/60"
                    >
                        {project.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-2xl md:text-3xl text-gray-800 dark:text-gray-200 font-medium break-keep leading-tight"
                    >
                        {project.slogan}
                    </motion.p>
                </motion.div>
            </section>

            {/* Content Sections */}
            <div className="max-w-[800px] mx-auto px-6 py-20 space-y-32">
                {/* Tech Stack Chips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    {stack.map((tech, i) => (
                        <span key={i} className="px-4 py-2 border border-blue-500/30 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
                            {tech}
                        </span>
                    ))}
                </motion.div>

                {/* Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h3 className="text-3xl md:text-4xl font-bold">{t.project.overview}.</h3>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light break-keep">
                        {project.overview}
                    </p>
                </motion.div>

                {/* Problem */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h3 className="text-3xl md:text-4xl font-bold">{t.project.problem}.</h3>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light break-keep">
                        {project.problem}
                    </p>
                </motion.div>

                {/* Solution */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h3 className="text-3xl md:text-4xl font-bold">{t.project.solution}.</h3>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light break-keep">
                        {project.solution}
                    </p>
                </motion.div>

                {/* Result */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl p-10 md:p-16 text-center border border-black/10 dark:border-white/10 shadow-xl dark:shadow-none"
                >
                    <h3 className="text-3xl font-bold mb-6">{t.project.result_title}</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 break-keep">{project.result}</p>

                    <div className="flex justify-center space-x-6">
                        <Magnetic>
                            <button className="flex items-center space-x-2 bg-gray-100 dark:bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                <Github className="w-5 h-5" /> <span>{t.project.source}</span>
                            </button>
                        </Magnetic>
                        <Magnetic>
                            <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-500 transition-colors">
                                <ExternalLink className="w-5 h-5" /> <span>{t.project.visit}</span>
                            </button>
                        </Magnetic>
                    </div>
                </motion.div>

                {/* Review */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h3 className="text-3xl md:text-4xl font-bold">{t.project.review}.</h3>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light break-keep">
                        {project.review}
                    </p>
                </motion.div>

                {/* Next Project Navigation */}
                <div className="py-20 border-t border-black/10 dark:border-white/10 mt-20">
                    <Link to="/" className="group block">
                        <span className="text-sm text-gray-500 mb-2 block">Next Project</span>
                        <h3 className="text-4xl md:text-6xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                            Back to All Projects <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
                        </h3>
                    </Link>
                </div>
            </div>
        </div>
    );
}
