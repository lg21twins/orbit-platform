
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Magnetic from './Magnetic';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Magnetic>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
        </Magnetic>
    );
}
