import { useState } from 'react';
import { Menu, X, TrendingUp, BarChart3, Settings, HelpCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: (isDark: boolean) => void;
}

const Header = ({ isDark, onToggleTheme }: HeaderProps) => {

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-lg transition-all duration-300 ${
      isDark 
        ? 'bg-background/80 border-border/50' 
        : 'bg-background/80 border-border/50'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                💱
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SwiftExchange
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Currency Exchange Platform
                </p>
              </div>
            </div>
          </div>



          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
