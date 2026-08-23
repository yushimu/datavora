import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  formatPrice: (priceStr: string) => string;
  usdRate: number | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'id';
  });
  
  const [usdRate, setUsdRate] = useState<number | null>(null);

  useEffect(() => {
    // Fetch live USD to IDR rate
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.IDR) {
          setUsdRate(data.rates.IDR);
        }
      })
      .catch(err => {
        console.error("Failed to fetch exchange rate:", err);
        // Fallback to static rate if API fails
        setUsdRate(15000);
      });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const formatPrice = (priceStr: string) => {
    // Extract numbers from price string (e.g., "1500000" or "Rp 1.500.000")
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) return priceStr; // Return original if not a number

    if (language === 'en') {
      const rate = usdRate || 15000;
      const usdValue = num / rate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(usdValue);
    } else {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, formatPrice, usdRate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
