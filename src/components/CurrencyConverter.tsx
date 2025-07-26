import { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, Loader2, Calculator, Bookmark, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurrencySelect from '@/components/CurrencySelect';
import ExchangeChart from '@/components/ExchangeChart';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Currency, ConversionHistoryItem, HistoricalRate } from '@/types/currency';
import { fetchExchangeRates, fetchHistoricalRates } from '@/services/exchangeAPI';
import { currencies } from '@/data/currencies';

interface CurrencyConverterProps {
  isDark: boolean;
  onConversion: (conversion: ConversionHistoryItem) => void;
}

const CurrencyConverter = ({ isDark, onConversion }: CurrencyConverterProps) => {
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies.find(c => c.code === 'USD')!);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies.find(c => c.code === 'EUR')!);
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalRate[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('7d');
  const [chartData, setChartData] = useState<Record<string, HistoricalRate[]>>({});
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // Quick amount presets
  const quickAmounts = [100, 500, 1000, 5000, 10000];

  // Chart timeframe options
  const timeframeOptions = [
    { value: '1d', label: '1D', days: 1 },
    { value: '7d', label: '7D', days: 7 },
    { value: '30d', label: '30D', days: 30 },
    { value: '90d', label: '90D', days: 90 },
    { value: '1y', label: '1Y', days: 365 }
  ] as const;

  const fetchHistoricalData = async (timeframe: typeof chartTimeframe) => {
    const days = timeframeOptions.find(opt => opt.value === timeframe)?.days || 7;
    const cacheKey = `${fromCurrency.code}-${toCurrency.code}-${timeframe}`;
    
    // Check if we already have this data cached
    if (chartData[cacheKey]) {
      setHistoricalData(chartData[cacheKey]);
      return;
    }

    setIsLoadingChart(true);
    try {
      const historical = await fetchHistoricalRates(fromCurrency.code, toCurrency.code, days);
      setHistoricalData(historical);
      setChartData(prev => ({ ...prev, [cacheKey]: historical }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
    setIsLoadingChart(false);
  };

  const handleTimeframeChange = (timeframe: typeof chartTimeframe) => {
    setChartTimeframe(timeframe);
    fetchHistoricalData(timeframe);
  };

  const convertCurrency = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    
    setIsLoading(true);
    try {
      const rates = await fetchExchangeRates(fromCurrency.code);
      const exchangeRate = rates[toCurrency.code];
      const convertedAmount = parseFloat(amount) * exchangeRate;
      
      setRate(exchangeRate);
      setResult(convertedAmount);
      setLastUpdated(new Date());
      
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
      
      // Fetch historical data for current timeframe
      await fetchHistoricalData(chartTimeframe);
      
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

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const debounce = setTimeout(convertCurrency, 500);
      return () => clearTimeout(debounce);
    }
  }, [amount, fromCurrency, toCurrency]);

  // Load default chart data when currency pair changes
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchHistoricalData(chartTimeframe);
    }
  }, [fromCurrency, toCurrency, chartTimeframe]);

  return (
    <div className="space-y-6">
      {/* Main Converter Card */}
      <Card className={`backdrop-blur-md border-0 shadow-enterprise-lg transition-all duration-500 ${
        isDark 
          ? 'bg-gray-800/90 shadow-blue-500/10' 
          : 'bg-white/90 shadow-blue-500/20'
      }`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-5 w-5" />
                Currency Converter
              </CardTitle>
              <CardDescription>
                Enterprise-grade currency conversion with real-time rates
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showAnalytics ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Analytics
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Amount Input Section */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-3 block">
              Amount to Convert
            </Label>
            <div className="space-y-3">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`text-xl h-12 font-semibold ${
                  isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-white/80 border-gray-200'
                }`}
                placeholder="Enter amount"
              />
              
              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className={`text-xs ${
                      amount === quickAmount.toString() 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : ''
                    }`}
                  >
                    {quickAmount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">From</Label>
              <CurrencySelect
                value={fromCurrency}
                onChange={setFromCurrency}
                isDark={isDark}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">To</Label>
              <CurrencySelect
                value={toCurrency}
                onChange={setToCurrency}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
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

          {/* Result Section */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-muted-foreground">
                Fetching latest rates...
              </span>
            </div>
          ) : result !== null ? (
            <div className={`space-y-4 p-6 rounded-xl transition-all duration-500 ${
              showAnimation ? 'animate-scale-in' : ''
            } ${isDark ? 'bg-gray-700/50' : 'bg-blue-50/80'}`}>
              {/* Main Result */}
              <div className="text-center">
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

              <Separator />

              {/* Transaction Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-medium">
                    {rate?.toLocaleString(undefined, { 
                      minimumFractionDigits: 6, 
                      maximumFractionDigits: 6 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <Alert className="border-green-200 bg-green-50/50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Conversion completed successfully with live market rates
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Enter an amount to see the conversion result
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      {showAnalytics && historicalData.length > 0 && (
        <Card className={`backdrop-blur-md border-0 shadow-enterprise-lg animate-slide-up ${
          isDark 
            ? 'bg-gray-800/90 shadow-blue-500/10' 
            : 'bg-white/90 shadow-blue-500/20'
        }`}>
          <CardContent className="p-6">
            <AnalyticsDashboard
              isDark={isDark}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              currentRate={rate || 0}
              historicalData={historicalData}
            />
          </CardContent>
        </Card>
      )}

      {/* Historical Chart */}
      {!showAnalytics && (
        <Card className={`backdrop-blur-md border-0 shadow-enterprise-lg ${
          isDark 
            ? 'bg-gray-800/90 shadow-blue-500/10' 
            : 'bg-white/90 shadow-blue-500/20'
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                  Price Chart: {fromCurrency.code} to {toCurrency.code}
                </CardTitle>
                <CardDescription>
                  Historical exchange rates and market trends
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {timeframeOptions.find(opt => opt.value === chartTimeframe)?.label}
              </Badge>
            </div>
            
            {/* Timeframe Selector */}
            <Tabs value={chartTimeframe} onValueChange={(value) => handleTimeframeChange(value as typeof chartTimeframe)}>
              <TabsList className="grid w-full max-w-md grid-cols-5">
                {timeframeOptions.map((option) => (
                  <TabsTrigger 
                    key={option.value} 
                    value={option.value}
                    className="text-xs"
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            {isLoadingChart ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading chart data...
                </span>
              </div>
            ) : historicalData.length > 0 ? (
              <ExchangeChart data={historicalData} isDark={isDark} />
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No chart data available</p>
                  <p className="text-xs">Try performing a conversion first</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CurrencyConverter;
