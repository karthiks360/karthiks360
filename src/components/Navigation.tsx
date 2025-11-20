import { Download } from 'lucide-react';
import { Button } from './ui/button';

export function Navigation() {
  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Blog', 'Contact'];

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white">K</span>
              </div>
              <span className="text-slate-900">Karthik S</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all px-4 py-2 rounded-lg"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Download Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
