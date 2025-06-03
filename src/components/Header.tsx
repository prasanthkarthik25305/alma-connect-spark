
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Users, LogIn } from 'lucide-react';

interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-soft" />
          </div>
          <span className="text-xl font-bold text-gradient">AlumniConnect</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">How it Works</a>
          <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">About</a>
        </nav>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            onClick={onLoginClick}
            className="hidden sm:flex items-center space-x-2 hover:bg-blue-accent/10"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Button>
          <Button 
            onClick={onSignupClick}
            className="bg-blue-accent hover:bg-blue-accent/90 text-white"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
