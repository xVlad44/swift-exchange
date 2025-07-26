import { Clock, ArrowRight, RotateCcw, Download, Filter, TrendingUp, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConversionHistoryItem } from '@/types/currency';
import { currencies } from '@/data/currencies';

interface ConversionHistoryProps {
  history: ConversionHistoryItem[];
  isDark: boolean;
  onClearHistory: () => void;
}

const ConversionHistory = ({ history, isDark, onClearHistory }: ConversionHistoryProps) => {
  const getCurrencyFlag = (code: string) => {
    return currencies.find(c => c.code === code)?.flag || '💱';
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const exportHistory = () => {
    const csvContent = [
      ['Timestamp', 'From', 'To', 'Amount', 'Result', 'Rate'].join(','),
      ...history.map(item => [
        new Date(item.timestamp).toISOString(),
        item.fromCurrency,
        item.toCurrency,
        item.amount,
        item.result,
        item.rate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversion-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };


  if (history.length === 0) {
    return (
      <Card className={`backdrop-blur-md border-0 shadow-enterprise ${
        isDark 
          ? 'bg-gray-800/90 shadow-blue-500/10' 
          : 'bg-white/90 shadow-blue-500/20'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
            Recent Conversions
          </CardTitle>
          <CardDescription>
            Your conversion history will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-4xl mb-2">📊</div>
            <p className="font-medium">No conversions yet</p>
            <p className="text-sm">Start converting to see your history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVolume = history.reduce((sum, item) => sum + item.amount, 0);
  const uniquePairs = new Set(history.map(item => `${item.fromCurrency}-${item.toCurrency}`)).size;

  return (
    <Card className={`backdrop-blur-md border-0 shadow-enterprise ${
      isDark 
        ? 'bg-gray-800/90 shadow-blue-500/10' 
        : 'bg-white/90 shadow-blue-500/20'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              Recent Conversions
            </CardTitle>
            <CardDescription>
              {history.length} conversion{history.length !== 1 ? 's' : ''} • {uniquePairs} pair{uniquePairs !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportHistory} className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClearHistory} className="gap-2 text-red-600 hover:text-red-700">
                <RotateCcw className="h-4 w-4" />
                Clear History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
            <div className="text-lg font-bold">
              ${totalVolume.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Volume</div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
            <div className="text-lg font-bold">
              {uniquePairs}
            </div>
            <div className="text-xs text-muted-foreground">Currency Pairs</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {history.slice(0, 8).map((item, index) => (
          <div key={item.id}>
            <div className={`group p-4 rounded-lg transition-all hover:scale-[1.02] cursor-pointer ${
              isDark 
                ? 'hover:bg-gray-700/30 border border-gray-700/50' 
                : 'hover:bg-blue-50/50 border border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCurrencyFlag(item.fromCurrency)}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg">{getCurrencyFlag(item.toCurrency)}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.fromCurrency}/{item.toCurrency}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatRelativeTime(item.timestamp)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.amount.toLocaleString()} {item.fromCurrency}
                  </span>
                  <span className="font-semibold">
                    {item.result.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 4 
                    })} {item.toCurrency}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Rate: {item.rate.toLocaleString(undefined, { 
                      minimumFractionDigits: 4, 
                      maximumFractionDigits: 6 
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
              </div>

            </div>
            
            {index < Math.min(history.length - 1, 7) && (
              <Separator className="my-2" />
            )}
          </div>
        ))}

        {history.length > 8 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" className="w-full">
              View All ({history.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversionHistory;
