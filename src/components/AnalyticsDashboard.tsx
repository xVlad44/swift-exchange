import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExchangeChart from '@/components/ExchangeChart';
import { Currency, HistoricalRate } from '@/types/currency';

interface AnalyticsDashboardProps {
  isDark: boolean;
  fromCurrency: Currency;
  toCurrency: Currency;
  currentRate?: number;
  historicalData: HistoricalRate[];
}

interface MarketData {
  high24h: number;
  low24h: number;
  change24h: number;
  volume: number;
  marketCap: string;
  volatility: number;
}

const AnalyticsDashboard = ({ 
  isDark, 
  fromCurrency, 
  toCurrency, 
  currentRate = 0,
  historicalData 
}: AnalyticsDashboardProps) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('7d');
  const [marketData, setMarketData] = useState<MarketData>({
    high24h: 0,
    low24h: 0,
    change24h: 0,
    volume: 0,
    marketCap: '0',
    volatility: 0
  });

  // Calculate market analytics from historical data
  useEffect(() => {
    if (historicalData.length > 0) {
      const rates = historicalData.map(d => d.rate);
      const high24h = Math.max(...rates);
      const low24h = Math.min(...rates);
      const firstRate = rates[0];
      const lastRate = rates[rates.length - 1];
      const change24h = ((lastRate - firstRate) / firstRate) * 100;
      
      // Calculate volatility (standard deviation)
      const mean = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
      const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / rates.length;
      const volatility = Math.sqrt(variance) / mean * 100;

      setMarketData({
        high24h,
        low24h,
        change24h,
        volume: Math.random() * 1000000000, // Mock volume
        marketCap: `${(Math.random() * 100).toFixed(1)}B`,
        volatility
      });
    }
  }, [historicalData]);

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number' 
  }: {
    title: string;
    value: number | string;
    change?: number;
    icon: any;
    format?: 'number' | 'currency' | 'percent' | 'volume';
  }) => {
    const formatValue = (val: number | string) => {
      if (typeof val === 'string') return val;
      
      switch (format) {
        case 'currency':
          return val.toLocaleString(undefined, { 
            minimumFractionDigits: 4, 
            maximumFractionDigits: 6 
          });
        case 'percent':
          return `${val.toFixed(2)}%`;
        case 'volume':
          return `$${(val / 1000000).toFixed(1)}M`;
        default:
          return val.toLocaleString();
      }
    };

    const getChangeColor = (change?: number) => {
      if (!change) return '';
      return change >= 0 ? 'text-green-500' : 'text-red-500';
    };

    const getChangeIcon = (change?: number) => {
      if (!change) return null;
      return change >= 0 ? TrendingUp : TrendingDown;
    };

    const ChangeIcon = getChangeIcon(change);

    return (
      <Card className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} transition-all hover:scale-105`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(value)}</div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${getChangeColor(change)}`}>
              {ChangeIcon && <ChangeIcon className="h-3 w-3" />}
              <span>{Math.abs(change).toFixed(2)}%</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Market Analytics</h3>
            <p className="text-sm text-muted-foreground">
              {fromCurrency.code}/{toCurrency.code} • Real-time insights
            </p>
          </div>
          <Badge variant={marketData.change24h >= 0 ? "default" : "destructive"} className="gap-1">
            {marketData.change24h >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(marketData.change24h).toFixed(2)}%
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Current Rate"
            value={currentRate}
            change={marketData.change24h}
            icon={DollarSign}
            format="currency"
          />
          <MetricCard
            title="24h High"
            value={marketData.high24h}
            icon={TrendingUp}
            format="currency"
          />
          <MetricCard
            title="24h Low"
            value={marketData.low24h}
            icon={TrendingDown}
            format="currency"
          />
          <MetricCard
            title="Volatility"
            value={marketData.volatility}
            icon={Activity}
            format="percent"
          />
        </div>
      </div>

      {/* Charts and Analysis */}
      <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="7d" className="space-y-4">
          <Card className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                7-Day Price Movement
              </CardTitle>
              <CardDescription>
                Exchange rate trends over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExchangeChart data={historicalData} isDark={isDark} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="30d" className="space-y-4">
          <Card className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
            <CardHeader>
              <CardTitle>30-Day Analysis</CardTitle>
              <CardDescription>
                Monthly performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Extended historical data would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="90d" className="space-y-4">
          <Card className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
            <CardHeader>
              <CardTitle>Quarterly Overview</CardTitle>
              <CardDescription>
                3-month performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Quarterly analysis would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="1y" className="space-y-4">
          <Card className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
            <CardHeader>
              <CardTitle>Annual Performance</CardTitle>
              <CardDescription>
                Year-over-year trends and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Annual performance data would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Market Summary */}
      <Card className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <CardHeader>
          <CardTitle>Market Summary</CardTitle>
          <CardDescription>
            Key insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Technical Analysis</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {marketData.change24h >= 0 ? 'Bullish' : 'Bearish'} trend over 24h</li>
                <li>• {marketData.volatility > 2 ? 'High' : 'Low'} volatility period</li>
                <li>• Support level: {marketData.low24h.toFixed(4)}</li>
                <li>• Resistance level: {marketData.high24h.toFixed(4)}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Market Sentiment</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Trading volume: {(marketData.volume / 1000000).toFixed(0)}M</li>
                <li>• Market activity: {marketData.volatility > 2 ? 'High' : 'Moderate'}</li>
                <li>• Trend strength: {Math.abs(marketData.change24h) > 1 ? 'Strong' : 'Weak'}</li>
                <li>• Recommendation: {marketData.change24h >= 0 ? 'Hold/Buy' : 'Monitor'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
