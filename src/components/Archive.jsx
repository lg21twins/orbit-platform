
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from './SEO';
import ThemeToggle from './ThemeToggle';

export default function Archive() {
    const { t } = useLanguage();

    const archiveItems = [
        { year: "2025", title: "Mini Weather App", builtWith: ["React", "API"], link: "#" },
        { year: "2024", title: "To-Do List Clone", builtWith: ["Vanilla JS", "LocalStorage"], link: "#" },
        { year: "2024", title: "Calculator", builtWith: ["React"], link: "#" },
        { year: "2023", title: "Landing Page Practice", builtWith: ["HTML", "CSS"], link: "#" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white font-sans selection:bg-blue-500/30 transition-colors duration-300">
            <SEO title="Archive" description="A collection of small projects and experiments." />
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10 h-[48px] flex items-center justify-between px-6 transition-colors duration-300">
                <Link to="/" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white flex items-center transition-colors text-sm">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>
                <ThemeToggle />
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">Archive</h1>
                    <p className="text-gray-600 dark:text-gray-400">A list of things I’ve built.</p>
                </motion.div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm">
                                <th className="py-4 font-medium">Year</th>
                                <th className="py-4 font-medium">Title</th>
                                <th className="py-4 font-medium hidden md:table-cell">Built with</th>
                                <th className="py-4 font-medium">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {archiveItems.map((item, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <td className="py-4 text-gray-500 dark:text-gray-400 text-sm">{item.year}</td>
                                    <td className="py-4 font-medium text-black dark:text-white">{item.title}</td>
                                    <td className="py-4 hidden md:table-cell">
                                        <div className="flex gap-2">
                                            {item.builtWith.map((tech, j) => (
                                                <span key={j} className="text-xs px-2 py-1 bg-black/5 dark:bg-white/10 rounded-full text-gray-700 dark:text-gray-300">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <a href={item.link} className="text-gray-500 hover:text-blue-500 transition-colors inline-block group-hover:translate-x-1 duration-200">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
