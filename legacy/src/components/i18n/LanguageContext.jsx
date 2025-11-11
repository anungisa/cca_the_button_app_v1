import React, { createContext, useState, useCallback } from 'react';
import translations from './translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = useCallback((key) => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};