'use client';

import { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Contact'];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white">K</span>
              </div>
              <span className="text-slate-900 dark:text-white">Karthik S</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-all px-4 py-2 rounded-lg"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              <a href="/resume.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMobileOpen(false)}
                className="block text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-all px-4 py-3 rounded-lg"
              >
                {item}
              </a>
            ))}
            <Button
              asChild
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <a href="/resume.pdf" download onClick={() => setMobileOpen(false)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
