import { Button } from './ui/button';
import { Download, Mail } from 'lucide-react';

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-slate-500 tracking-wider uppercase text-sm">Hello, I am</p>
            <h1 className="text-slate-900 text-5xl sm:text-6xl lg:text-7xl">
              Karthik S
            </h1>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-3xl sm:text-4xl">
              Software Developer
            </h2>
          </div>

          <p className="text-slate-600 text-lg max-w-xl leading-relaxed">
            Software Developer at SISA Information Security, passionate about building innovative solutions and exploring new technologies.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all rounded-xl px-8"
            >
              <Mail className="mr-2 h-5 w-5" />
              Hire Me
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl px-8 transition-all"
            >
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Button>
          </div>
        </div>

        {/* Right Side - Animated Visual */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* Main Circle */}
            <div className="w-80 h-80 sm:w-96 sm:h-96 relative">
              {/* Animated Rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>

              {/* Center Avatar */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-sm flex items-center justify-center border-4 border-white/10">
                  <span className="text-white text-8xl opacity-90">K</span>
                </div>
              </div>

              {/* Floating Particles */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full blur-sm animate-bounce"></div>
              <div className="absolute bottom-10 right-10 w-3 h-3 bg-purple-500 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute bottom-0 left-10 w-5 h-5 bg-blue-400 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute top-10 left-0 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.9s' }}></div>
            </div>

            {/* Glow Effects */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
