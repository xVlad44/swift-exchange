
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalRate } from '@/types/currency';

interface ExchangeChartProps {
  data: HistoricalRate[];
  isDark: boolean;
}

const ExchangeChart = ({ data, isDark }: ExchangeChartProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg border shadow-lg ${
          isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
        }`}>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {formatDate(label)}
          </p>
          <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Rate: {payload[0].value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? '#374151' : '#e5e7eb'} 
          />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <YAxis 
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            tickFormatter={(value) => value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4
            })}
          />
          <Tooltip content={customTooltip} />
          <Line 
            type="monotone" 
            dataKey="rate" 
            stroke={isDark ? '#60a5fa' : '#3b82f6'}
            strokeWidth={3}
            dot={{ fill: isDark ? '#60a5fa' : '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: isDark ? '#60a5fa' : '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExchangeChart;
