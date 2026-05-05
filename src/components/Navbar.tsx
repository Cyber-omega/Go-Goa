import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut, Car, Users, Shield, Compass } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { auth } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-gray-100 dark:border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-transparent p-0">
            <img src="/logo.svg" alt="GO Goa Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-palm font-heading uppercase">GO Goa</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/explore" className="flex items-center gap-1 text-sm font-bold text-ink/60 dark:text-foreground/60 hover:text-palm transition-colors">
            <Compass className="w-4 h-4" />
            Explore
          </Link>
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="hidden md:block text-sm font-medium text-ink/60 dark:text-foreground/60 hover:text-palm transition-colors">
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-10 w-10 rounded-full" />}>
                  <Avatar>
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate('/login')} className="bg-palm hover:bg-palm/90">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
