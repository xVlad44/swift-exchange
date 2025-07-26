
import { useState, useEffect } from 'react';
import { Globe, Zap, Shield, Award } from 'lucide-react';
import Header from '@/components/Header';
import CurrencyConverter from '@/components/CurrencyConverter';
import ConversionHistory from '@/components/ConversionHistory';
import StatusIndicators from '@/components/StatusIndicators';
import { ConversionHistoryItem } from '@/types/currency';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

    // Monitor network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const addToHistory = (conversion: ConversionHistoryItem) => {
    const newHistory = [conversion, ...history.slice(0, 4)]; // Keep 5 items
    setHistory(newHistory);
    localStorage.setItem('conversionHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversionHistory');
  };

  const features = [
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Support for 30+ major currencies with real-time rates"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second conversion with live market data"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and security protocols"
    },
    {
      icon: Award,
      title: "Accurate Rates",
      description: "Professional-grade data from trusted financial sources"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark 
      ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Navigation Header */}
      <Header isDark={isDark} onToggleTheme={setIsDark} />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">


          <h3 className={`text-xl font-bold md:text-2xl mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Free and open-source currency conversion platform for everyone
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Globe className="h-4 w-4 mr-2" />
              30+ Currencies
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Zap className="h-4 w-4 mr-2" />
              Real-time Rates
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Enterprise Grade
            </Badge>
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center">
            <StatusIndicators 
              isDark={isDark} 
              isOnline={isOnline}
              apiStatus="healthy"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Currency Converter - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <CurrencyConverter isDark={isDark} onConversion={addToHistory} />
          </div>
          
          {/* Conversion History - Takes 1 column */}
          <div className="lg:col-span-1 space-y-6">
            <ConversionHistory history={history} isDark={isDark} onClearHistory={clearHistory} />
            
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-12">
          <p>
            Built with ❤️ by <a href="https://github.com/xVlad44" target="_blank" rel="noopener noreferrer">xVlad44</a>
          </p>
          <p>
            Check out the <a href="https://github.com/xVlad44/swift-exchange" target="_blank" rel="noopener noreferrer">GitHub repository</a> for more information.
          </p>
          <p>
            Need help? Join our <a href="https://discord.com/invite/GyJesnvvAf" target="_blank" rel="noopener noreferrer">Discord server</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
