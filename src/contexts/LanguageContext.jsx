import { createContext, useContext, useState } from 'react';

import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('ko');
    const t = translations[lang];
    const toggleLang = () => setLang(prev => prev === 'ko' ? 'en' : 'ko');

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
