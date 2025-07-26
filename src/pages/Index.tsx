
import { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import CurrencyConverter from '@/components/CurrencyConverter';
import ConversionHistory from '@/components/ConversionHistory';
import ThemeToggle from '@/components/ThemeToggle';
import { ConversionHistoryItem } from '@/types/currency';

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    
    // Load conversion history
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const addToHistory = (conversion: ConversionHistoryItem) => {
    const newHistory = [conversion, ...history.slice(0, 4)];
    setHistory(newHistory);
    localStorage.setItem('conversionHistory', JSON.stringify(newHistory));
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark 
      ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
              💱
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${isDark ? 'from-blue-400 to-purple-400' : ''}`}>
              CurrencyFlow
            </h1>
          </div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            💱 Convert currencies instantly — powered by live rates!
          </p>
          <ThemeToggle isDark={isDark} onToggle={setIsDark} />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currency Converter */}
          <div className="lg:col-span-2">
            <CurrencyConverter isDark={isDark} onConversion={addToHistory} />
          </div>
          
          {/* Conversion History */}
          <div className="lg:col-span-1">
            <ConversionHistory history={history} isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
