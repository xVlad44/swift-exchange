
import { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CurrencySelect from '@/components/CurrencySelect';
import ExchangeChart from '@/components/ExchangeChart';
import { Currency, ConversionHistoryItem, HistoricalRate } from '@/types/currency';
import { fetchExchangeRates, fetchHistoricalRates } from '@/services/exchangeAPI';
import { currencies } from '@/data/currencies';

interface CurrencyConverterProps {
  isDark: boolean;
  onConversion: (conversion: ConversionHistoryItem) => void;
}

const CurrencyConverter = ({ isDark, onConversion }: CurrencyConverterProps) => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies.find(c => c.code === 'USD')!);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies.find(c => c.code === 'EUR')!);
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalRate[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  const convertCurrency = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    
    setIsLoading(true);
    try {
      const rates = await fetchExchangeRates(fromCurrency.code);
      const exchangeRate = rates[toCurrency.code];
      const convertedAmount = parseFloat(amount) * exchangeRate;
      
      setRate(exchangeRate);
      setResult(convertedAmount);
      
      // Add to history
      const conversion: ConversionHistoryItem = {
        id: Date.now().toString(),
        fromCurrency: fromCurrency.code,
        toCurrency: toCurrency.code,
        amount: parseFloat(amount),
        result: convertedAmount,
        rate: exchangeRate,
        timestamp: new Date()
      };
      onConversion(conversion);
      
      // Trigger animation
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 600);
      
      // Fetch historical data
      const historical = await fetchHistoricalRates(fromCurrency.code, toCurrency.code);
      setHistoricalData(historical);
      
    } catch (error) {
      console.error('Conversion error:', error);
    }
    setIsLoading(false);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setRate(null);
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const debounce = setTimeout(convertCurrency, 500);
      return () => clearTimeout(debounce);
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="space-y-6">
      {/* Main Converter Card */}
      <Card className={`p-8 backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
        isDark 
          ? 'bg-gray-800/80 shadow-blue-500/10' 
          : 'bg-white/80 shadow-blue-500/20'
      }`}>
        {/* Amount Input */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Amount
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`text-2xl h-14 font-semibold ${
              isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-white/80 border-gray-200'
            }`}
            placeholder="Enter amount"
          />
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              From
            </label>
            <CurrencySelect
              value={fromCurrency}
              onChange={setFromCurrency}
              isDark={isDark}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              To
            </label>
            <CurrencySelect
              value={toCurrency}
              onChange={setToCurrency}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={swapCurrencies}
            variant="outline"
            size="icon"
            className={`rounded-full w-12 h-12 border-2 transition-all duration-300 hover:scale-110 ${
              isDark 
                ? 'border-blue-400 hover:bg-blue-400/20 text-blue-400' 
                : 'border-blue-500 hover:bg-blue-50 text-blue-500'
            }`}
          >
            <ArrowLeftRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Result */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : result !== null ? (
          <div className={`text-center p-6 rounded-xl transition-all duration-500 ${
            showAnimation ? 'animate-pulse scale-105' : ''
          } ${isDark ? 'bg-gray-700/50' : 'bg-blue-50/80'}`}>
            <div className={`text-3xl md:text-4xl font-bold mb-2 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {toCurrency.flag} {result.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 6 
              })} {toCurrency.code}
            </div>
            {rate && (
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                1 {fromCurrency.code} = {rate.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 6 
                })} {toCurrency.code}
              </div>
            )}
          </div>
        ) : null}
      </Card>

      {/* Historical Chart */}
      {historicalData.length > 0 && (
        <Card className={`p-6 backdrop-blur-sm border-0 shadow-xl ${
          isDark 
            ? 'bg-gray-800/80 shadow-blue-500/10' 
            : 'bg-white/80 shadow-blue-500/20'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              7-Day Trend: {fromCurrency.code} to {toCurrency.code}
            </h3>
          </div>
          <ExchangeChart data={historicalData} isDark={isDark} />
        </Card>
      )}
    </div>
  );
};

export default CurrencyConverter;
