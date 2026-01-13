import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { ChevronRight, PlayCircle, Layers, ShieldCheck, Zap, Globe, X, Instagram } from 'lucide-react';
import Magnetic from './Magnetic';
import { useState, useContext } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';





import SEO from './SEO';

export default function AppleLandingPage() {
    const { lang, toggleLang, t } = useLanguage();

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 font-sans overflow-x-hidden group transition-colors duration-300"
            onMouseMove={handleMouseMove}
        >
            <SEO />
            <motion.div
                className="pointer-events-none fixed -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                    background: useMotionTemplate`
                            radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(29, 78, 216, 0.15),
                            transparent 80%
                            )
                        `,
                }}
            />
            <Navbar />
            <HeroSection />
            <GridSection />
            <Footer />
        </div>
    );
}

function Navbar() {
    const { t, lang, toggleLang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when menu is open
    if (typeof window !== 'undefined') {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10 transition-colors duration-300"
            >
                <div className="max-w-[980px] mx-auto h-[48px] md:h-[44px] flex items-center justify-between px-4 md:px-6 text-[12px] font-medium tracking-tight text-gray-800 dark:text-gray-200">
                    <div className="flex items-center space-x-8">
                        <img src="/logo.jpg" alt="Logo" className="h-8 w-auto object-contain cursor-pointer dark:invert" />
                        <a href="#projects" className="hidden md:inline hover:text-black dark:hover:text-white transition-colors">{t.nav.store}</a>
                        <Link to="/about" className="hidden md:inline hover:text-black dark:hover:text-white transition-colors">{t.nav.mac}</Link>
                        <Link to="/interaction" className="hidden md:inline hover:text-black dark:hover:text-white transition-colors">AI Demo</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleLang}
                            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs font-medium"
                        >
                            {lang === 'ko' ? 'EN' : 'KR'}
                        </button>
                        <ThemeToggle />
                        <Magnetic>
                            <a href="https://instagram.com/shonyechan" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full text-xs transition-colors cursor-pointer flex items-center gap-1">
                                {t.nav.buy}
                            </a>
                        </Magnetic>

                        {/* Mobile Hamburger Button (3 lines) */}
                        <div
                            className="md:hidden flex flex-col justify-between w-5 h-4 cursor-pointer p-0.5 z-50"
                            onClick={() => setIsOpen(true)}
                        >
                            <span className="w-full h-0.5 bg-gray-800 dark:bg-gray-300 rounded-full"></span>
                            <span className="w-full h-0.5 bg-gray-800 dark:bg-gray-300 rounded-full"></span>
                            <span className="w-full h-0.5 bg-gray-800 dark:bg-gray-300 rounded-full"></span>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-[60] bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex flex-col"
                    >
                        <div className="flex justify-between items-center px-4 h-[48px] border-b border-black/10 dark:border-white/10">
                            <img src="/logo.jpg" alt="Logo" className="h-8 w-auto object-contain cursor-pointer dark:invert" />
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col px-10 py-10 space-y-6">
                            <motion.a href="#projects" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors">
                                {t.nav.store}
                            </motion.a>
                            <motion.div onClick={() => setIsOpen(false)}>
                                <Link to="/about" className="text-2xl font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors">
                                    {t.nav.mac}
                                </Link>
                            </motion.div>
                            <motion.div onClick={() => setIsOpen(false)}>
                                <Link to="/interaction" className="text-2xl font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors">
                                    AI Demo
                                </Link>
                            </motion.div>

                            <div className="h-px bg-black/10 dark:bg-white/10 w-full my-4"></div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Language</span>
                                <div className="flex items-center space-x-4">
                                    <ThemeToggle />
                                    <button
                                        onClick={toggleLang}
                                        className="text-black dark:text-white font-medium border border-black/20 dark:border-white/20 px-4 py-2 rounded-full"
                                    >
                                        {lang === 'ko' ? 'English' : '한국어'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function HeroSection() {
    const { t } = useLanguage();
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

    return (
        <section className="h-screen flex flex-col items-center justify-center relative pt-20">
            <motion.div
                style={{ opacity, scale }}
                className="text-center z-10 px-4"
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-3xl font-semibold text-blue-600 dark:text-blue-500 mb-2"
                >
                    {t.hero.subtitle}
                </motion.h2>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-8xl font-bold tracking-tight mb-6 text-black dark:text-white"
                >
                    {t.hero.name}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium break-keep"
                >
                    {t.hero.desc}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mt-10 relative z-10"
                >
                    <Magnetic>
                        <Link to="/about">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center text-lg md:text-xl font-medium group px-6 py-3 rounded-full hover:bg-blue-500/10 transition-all cursor-pointer">
                                {t.hero.learnMore} <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </Magnetic>
                    <Magnetic>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center text-lg md:text-xl font-medium group px-6 py-3 rounded-full hover:bg-blue-500/10 transition-all cursor-pointer">
                            {t.hero.watch} <PlayCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                        </button>
                    </Magnetic>
                </motion.div>
            </motion.div>
        </section>
    );
}




function GridSection() {
    const { t } = useLanguage();
    const projects = [
        { id: "portfolio", icon: <Zap className="w-8 h-8" />, title: t.grid.p1_title, desc: t.grid.p1_desc },
        { id: "ecommerce", icon: <ShieldCheck className="w-8 h-8" />, title: t.grid.p2_title, desc: t.grid.p2_desc },
        { id: "dashboard", icon: <Layers className="w-8 h-8" />, title: t.grid.p3_title, desc: t.grid.p3_desc },
    ];

    return (
        <section className="py-32 bg-gray-50 dark:bg-zinc-900 transition-colors duration-300" id="projects">
            <div className="max-w-[980px] mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white">{t.grid.title}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {projects.map((p, i) => (
                        <Link to={`/project/${p.id}`} key={i}>
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white dark:bg-black p-10 rounded-3xl border border-black/5 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-lg dark:shadow-none transition-all h-full flex flex-col justify-between"
                            >
                                <div>
                                    <div className="text-gray-800 dark:text-gray-300 mb-4">{p.icon}</div>
                                    <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">{p.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-500">{p.desc}</p>
                                </div>
                                <div className="mt-8 flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                                    View Analysis <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-gray-100 dark:bg-black py-12 border-t border-black/5 dark:border-white/10 text-xs text-gray-500 transition-colors duration-300">
            <div className="max-w-[980px] mx-auto px-6">
                <p className="mb-4">
                    {t.footer.disclaimer}
                </p>
                <div className="h-px bg-black/10 dark:bg-white/10 my-6"></div>
                <div className="flex justify-between items-center">
                    <p>{t.footer.copyright}</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:underline">{t.footer.privacy}</a>
                        <a href="#" className="hover:underline">{t.footer.terms}</a>
                        <a href="#" className="hover:underline">{t.footer.sales}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
