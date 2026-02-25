import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Lock, Menu, X, Shield } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'HOME' },
  { to: '/agents', label: 'AGENTS' },
  { to: '/missions', label: 'MISSIONS' },
  { to: '/assets', label: 'ASSETS' },
  { to: '/weapons', label: 'WEAPONS' },
  { to: '/most-wanted', label: 'MOST WANTED' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-ops-black border-b border-ops-green-dim scanline">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/generated/wraith-emblem.dim_400x400.png"
              alt="W.R.A.I.T.H. Emblem"
              className="h-10 w-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="flex flex-col">
              <span className="font-orbitron text-ops-green text-lg font-bold tracking-widest leading-none glow-green flicker">
                W.R.A.I.T.H.
              </span>
              <span className="font-mono text-ops-text-dim text-[9px] tracking-[0.3em] leading-none mt-0.5">
                CLASSIFIED OPERATIONS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 font-mono text-xs tracking-widest transition-all duration-200 border border-transparent
                  ${isActive(link.to)
                    ? 'text-ops-green border-ops-green-dim bg-ops-green/10 glow-green'
                    : 'text-ops-text-dim hover:text-ops-green hover:border-ops-green-dim hover:bg-ops-green/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className={`ml-2 px-3 py-2 font-mono text-xs tracking-widest transition-all duration-200 flex items-center gap-1.5 border
                ${isActive('/admin')
                  ? 'text-ops-red border-ops-red bg-ops-red/10 glow-red'
                  : 'text-ops-red border-ops-red/50 hover:border-ops-red hover:bg-ops-red/10'
                }`}
            >
              <Lock className="h-3 w-3" />
              ADMIN
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-ops-green p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ops-green-dim py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 font-mono text-xs tracking-widest
                  ${isActive(link.to) ? 'text-ops-green glow-green' : 'text-ops-text-dim hover:text-ops-green'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2 font-mono text-xs tracking-widest text-ops-red hover:text-ops-red-bright"
            >
              <Lock className="h-3 w-3" />
              ADMIN ACCESS
            </Link>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="bg-ops-dark border-t border-ops-green-dim/30 px-4 py-0.5 flex items-center gap-4 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-ops-green animate-pulse" />
          <span className="font-mono text-[9px] text-ops-text-dim tracking-widest">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-2.5 w-2.5 text-ops-green-dim" />
          <span className="font-mono text-[9px] text-ops-text-dim tracking-widest">SECURE CHANNEL ACTIVE</span>
        </div>
        <div className="ml-auto font-mono text-[9px] text-ops-text-dim tracking-widest">
          TITLE 50 AUTHORITY
        </div>
      </div>
    </nav>
  );
}
