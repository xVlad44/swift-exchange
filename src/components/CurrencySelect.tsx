
import { useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Currency } from '@/types/currency';
import { currencies } from '@/data/currencies';

interface CurrencySelectProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  isDark: boolean;
}

const CurrencySelect = ({ value, onChange, isDark }: CurrencySelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCurrencies = currencies.filter(
    currency =>
      currency.code.toLowerCase().includes(search.toLowerCase()) ||
      currency.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between h-12 px-4 font-semibold text-left ${
            isDark 
              ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 text-white' 
              : 'bg-white/80 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{value.flag}</span>
            <div>
              <div className="font-bold">{value.code}</div>
              <div className={`text-xs truncate max-w-32 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {value.name}
              </div>
            </div>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-80 p-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search currencies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`pl-9 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}
            />
          </div>
        </div>
        <div className="max-h-64 overflow-auto">
          {filteredCurrencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => {
                onChange(currency);
                setOpen(false);
                setSearch('');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                value.code === currency.code ? 'bg-blue-50 dark:bg-blue-900/30' : ''
              }`}
            >
              <span className="text-xl">{currency.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{currency.code}</div>
                <div className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currency.name}
                </div>
              </div>
              {value.code === currency.code && (
                <Check className="h-4 w-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencySelect;
