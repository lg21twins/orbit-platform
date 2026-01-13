
import { motion } from 'framer-motion';

export default function ExperienceTimeline() {
    const experiences = [
        {
            year: "2024 - Present",
            title: "Frontend Engineer",
            company: "Tech Startup A",
            description: "Leading the frontend team, migrating to Next.js, and implementing a design system."
        },
        {
            year: "2022 - 2024",
            title: "Web Developer",
            company: "Creative Agency B",
            description: "Built award-winning interactive websites for global brands using React and WebGL."
        },
        {
            year: "2020 - 2022",
            title: "UI/UX Designer",
            company: "Freelance",
            description: "Designed user interfaces for mobile apps and web platforms, focusing on accessibility."
        }
    ];

    return (
        <div className="space-y-12 pl-4 border-l border-gray-200 dark:border-gray-800 ml-4 md:ml-0">
            {experiences.map((exp, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="relative pl-8"
                >
                    {/* Dot */}
                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-black" />

                    <span className="text-sm font-medium text-blue-600 dark:text-blue-500 mb-1 block">{exp.year}</span>
                    <h4 className="text-xl font-bold text-black dark:text-white">{exp.title}</h4>
                    <span className="text-gray-500 dark:text-gray-400 text-sm mb-2 block">{exp.company}</span>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light mt-2">
                        {exp.description}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
