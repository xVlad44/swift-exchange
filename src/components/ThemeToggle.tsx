
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: (isDark: boolean) => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => onToggle(!isDark)}
          variant="outline"
          size="icon"
          className={`rounded-full w-10 h-10 border-2 transition-all duration-300 hover:scale-110 ${
            isDark 
              ? 'border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10 text-yellow-400' 
              : 'border-blue-500/50 hover:border-blue-500 hover:bg-blue-50 text-blue-500'
          }`}
        >
          {isDark ? (
            <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
          ) : (
            <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Switch to {isDark ? 'light' : 'dark'} theme</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
