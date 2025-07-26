
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: (isDark: boolean) => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <Button
      onClick={() => onToggle(!isDark)}
      variant="outline"
      size="icon"
      className={`fixed top-4 right-4 z-50 rounded-full w-12 h-12 border-2 transition-all duration-300 hover:scale-110 ${
        isDark 
          ? 'border-yellow-400 hover:bg-yellow-400/20 text-yellow-400 bg-gray-800/80' 
          : 'border-blue-500 hover:bg-blue-50 text-blue-500 bg-white/80'
      } backdrop-blur-sm shadow-lg`}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
