import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="bg-slate-900 text-white py-16 mt-20 relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-10">
          {/* Follow Me Section */}
          <div className="text-center space-y-6">
            <h3 className="text-2xl text-slate-200">Follow Me</h3>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative w-14 h-14 bg-slate-800/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-700 hover:border-transparent hover:scale-110"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <social.icon className="w-6 h-6 relative z-10" />
                </a>
              ))}
            </div>
          </div>

          {/* Divider with Gradient */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-slate-400">© 2025 Karthik S — karthiks360.com</p>
            <p className="text-slate-500 text-sm">All rights reserved</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
    </footer>
  );
}
