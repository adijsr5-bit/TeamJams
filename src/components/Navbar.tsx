'use client';
import { Leaf, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center group-hover:bg-brand-green/30 transition-colors">
            <Leaf className="text-brand-green w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-light">
            Team<span className="text-brand-green">Jams</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-muted">
          <Link href="/#events" className="hover:text-brand-light transition-colors">Events</Link>
          <Link href="/#impact" className="hover:text-brand-light transition-colors">Impact</Link>
          <Link href="/#donate" className="hover:text-brand-light transition-colors">Donate</Link>
          <Link href="/#report" className="hover:text-brand-light transition-colors">Report Dirt</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/profile" className="text-sm font-medium text-brand-light hover:text-brand-green transition-colors">
                {user.name}
              </Link>
              {(user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'ngo') && (
                <Link href="/admin" className="text-sm font-medium text-brand-accent hover:text-brand-light transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="text-sm font-medium text-brand-muted hover:text-red-400 transition-colors">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-brand-light hover:text-brand-green transition-colors">
                Log In
              </Link>
              <Link href="/register" className="bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                Join Movement
              </Link>
            </>
          )}
        </div>
        
        <button onClick={toggleMenu} className="md:hidden text-brand-light p-2 focus:outline-none">
          {isMenuOpen ? <span className="text-2xl leading-none">&times;</span> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-brand-dark/95 backdrop-blur-lg border-b border-white/5 py-4 px-6 flex flex-col gap-4 shadow-xl">
          <Link href="/#events" onClick={toggleMenu} className="text-brand-light font-medium py-2 border-b border-white/5">Events</Link>
          <Link href="/#impact" onClick={toggleMenu} className="text-brand-light font-medium py-2 border-b border-white/5">Impact</Link>
          <Link href="/#donate" onClick={toggleMenu} className="text-brand-light font-medium py-2 border-b border-white/5">Donate</Link>
          <Link href="/#report" onClick={toggleMenu} className="text-brand-light font-medium py-2 border-b border-white/5">Report Dirt</Link>
          
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
            {user ? (
              <>
                <Link href="/profile" onClick={toggleMenu} className="text-brand-green font-medium py-2">
                  My Profile ({user.name})
                </Link>
                {(user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'ngo') && (
                  <Link href="/admin" onClick={toggleMenu} className="text-brand-accent font-medium py-2">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { logout(); toggleMenu(); }} className="text-left text-red-400 font-medium py-2">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={toggleMenu} className="text-brand-light font-medium py-2 text-center border border-white/20 rounded-full">
                  Log In
                </Link>
                <Link href="/register" onClick={toggleMenu} className="bg-brand-green text-white font-medium py-2 text-center rounded-full">
                  Join Movement
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
