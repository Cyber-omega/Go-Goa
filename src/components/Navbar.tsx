import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut, Car, Users, Shield, Compass, Palmtree } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass-teal border-none mx-4 my-4 rounded-3xl px-8 py-5 flex items-center justify-center stacked-shadow">
      <div className="w-full max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative group-hover:scale-110 transition-transform duration-500">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 glow-ocean">
              <Palmtree className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-palm/40 blur-xl rounded-full scale-150 animate-pulse -z-10" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white font-heading uppercase">GO Goa</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/explore" className="flex items-center gap-2 text-[10px] font-black text-white/70 hover:text-white transition-all uppercase tracking-[0.3em] group">
            <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
            <span className="hidden sm:inline">Discovery</span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="hidden md:block text-[10px] font-black text-white/70 hover:text-white transition-all uppercase tracking-[0.3em]">
                Console
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full border-2 border-white/20 hover:border-white/50 transition-all p-0 overflow-hidden outline-none bg-transparent cursor-pointer flex items-center justify-center">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback className="bg-palm/40 text-white font-bold">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-[32px] p-3 bg-card/90 backdrop-blur-3xl border-white/10 premium-shadow">
                  <div className="px-4 py-4 mb-2 border-b border-palm/5">
                    <p className="text-xs font-black uppercase tracking-widest text-palm/40">Registered Voyager</p>
                    <p className="text-sm font-bold text-ink truncate">{user.displayName || user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-2xl font-bold py-3 hover:bg-palm/5 cursor-pointer">
                    <User className="mr-3 h-4 w-4 text-palm" />
                    <span className="text-xs uppercase tracking-widest">My Heritage Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="rounded-2xl font-bold py-3 hover:bg-red-50 text-red-600 cursor-pointer">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="text-xs uppercase tracking-widest">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-accent-gradient text-white font-black rounded-2xl h-11 uppercase tracking-[0.2em] text-[10px] px-8 transition-all active:scale-95 glow-terra border-none"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
