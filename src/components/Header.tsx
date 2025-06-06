
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  console.log('Header - User:', user?.id, 'Role:', user?.role, 'Loading:', loading);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setAuthModalTab('signin');
      setShowAuthModal(true);
    }
  };

  const handleSignupClick = () => {
    if (onSignupClick) {
      onSignupClick();
    } else {
      setAuthModalTab('signup');
      setShowAuthModal(true);
    }
  };

  const handleDashboardNavigation = () => {
    console.log('Dashboard navigation clicked for user role:', user?.role);
    
    if (!user?.role) {
      console.log('No user role available, cannot navigate');
      return;
    }

    if (user.role === 'student') {
      console.log('Navigating to student dashboard');
      navigate('/student-dashboard');
    } else if (user.role === 'alumni') {
      console.log('Navigating to alumni dashboard');
      navigate('/alumni-dashboard');
    } else if (user.role === 'admin') {
      console.log('Navigating to admin dashboard');
      navigate('/admin-dashboard');
    } else {
      console.log('Unknown role:', user.role);
    }
  };

  const handleProfileNavigation = () => {
    if (user?.role === 'student') {
      navigate('/student-profile');
    } else if (user?.role === 'alumni') {
      navigate('/alumni-profile');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="text-2xl font-bold text-gradient cursor-pointer" 
              onClick={() => navigate('/')}
            >
              AlumniConnect
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
                About
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.full_name || user.email}</span>
                      {user.role && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {user.role}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDashboardNavigation}>
                      Dashboard
                    </DropdownMenuItem>
                    {(user.role === 'student' || user.role === 'alumni') && (
                      <DropdownMenuItem onClick={handleProfileNavigation}>
                        Profile
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={handleLoginClick}>
                    Login
                  </Button>
                  <Button size="sm" onClick={handleSignupClick}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultTab={authModalTab}
      />
    </>
  );
};
