
import { Clock, ArrowRight, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConversionHistoryItem } from '@/types/currency';
import { currencies } from '@/data/currencies';

interface ConversionHistoryProps {
  history: ConversionHistoryItem[];
  isDark: boolean;
}

const ConversionHistory = ({ history, isDark }: ConversionHistoryProps) => {
  const getCurrencyFlag = (code: string) => {
    return currencies.find(c => c.code === code)?.flag || '💱';
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (history.length === 0) {
    return (
      <Card className={`p-6 backdrop-blur-sm border-0 shadow-xl ${
        isDark 
          ? 'bg-gray-800/80 shadow-blue-500/10' 
          : 'bg-white/80 shadow-blue-500/20'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent Conversions
          </h3>
        </div>
        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-4xl mb-2">📊</div>
          <p>No conversions yet</p>
          <p className="text-sm">Your recent conversions will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 backdrop-blur-sm border-0 shadow-xl ${
      isDark 
        ? 'bg-gray-800/80 shadow-blue-500/10' 
        : 'bg-white/80 shadow-blue-500/20'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Conversions
        </h3>
      </div>
      
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
              isDark 
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCurrencyFlag(item.fromCurrency)}</span>
                <span className="font-semibold text-sm">{item.fromCurrency}</span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
                <span className="text-lg">{getCurrencyFlag(item.toCurrency)}</span>
                <span className="font-semibold text-sm">{item.toCurrency}</span>
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTime(item.timestamp)}
              </span>
            </div>
            
            <div className="text-sm">
              <div className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {item.amount.toLocaleString()} → {item.result.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}
              </div>
              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Rate: {item.rate.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ConversionHistory;
