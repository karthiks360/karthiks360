import { Button } from './ui/button';
import { Mail } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-[calc(100vh-4rem)] py-16 sm:py-20">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            {/* Terminal-style prompt accent */}
            <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400">~/karthiks360</span>
              <span className="text-slate-400 dark:text-slate-600"> $ </span>
              <span className="text-blue-600 dark:text-blue-400">whoami</span>
            </p>
            <h1 className="text-slate-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl">
              Karthik S
            </h1>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-3xl sm:text-4xl">
              Software Developer
            </h2>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-xl leading-relaxed">
            Software Developer with 4+ years building backend services, REST APIs, and cloud infrastructure. Currently developing AI-driven enterprise security platforms at SISA, Bengaluru.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all rounded-xl px-8"
            >
              <a href="mailto:karthiksridhara.work@gmail.com?subject=Let%27s%20work%20together">
                <Mail className="mr-2 h-5 w-5" />
                Hire Me
              </a>
            </Button>
          </div>

          {/* Stat row */}
          <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-200/70 dark:border-slate-800/70">
            {[
              { value: '4+', label: 'Years experience' },
              { value: '3', label: 'Companies' },
              { value: '10+', label: 'Technologies' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Code Editor Window */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* Ambient backlight — soft halo wrapping the editor */}
            <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-indigo-500/40 rounded-[2.5rem] blur-3xl" aria-hidden="true"></div>
            {/* Corner accent glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400 rounded-full opacity-30 dark:opacity-40 blur-3xl" aria-hidden="true"></div>
            <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-purple-500 rounded-full opacity-30 dark:opacity-40 blur-3xl" aria-hidden="true"></div>

            {/* Editor Window */}
            <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Title Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
                <span className="ml-3 font-mono text-xs text-slate-500 dark:text-slate-400">developer.ts</span>
              </div>

              {/* Code Body */}
              <div className="flex font-mono text-sm leading-relaxed">
                {/* Line numbers */}
                <div className="select-none py-4 px-3 text-right text-slate-300 dark:text-slate-600 border-r border-slate-200/70 dark:border-slate-800">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Code */}
                <pre className="py-4 px-4 overflow-x-auto text-slate-700 dark:text-slate-300">
                  <code>
                    <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">engineer</span>{' '}
                    <span className="text-slate-400">=</span>{' '}
                    <span className="text-slate-400">{'{'}</span>
                    {'\n'}
                    {'  '}
                    <span className="text-sky-600 dark:text-sky-400">name</span>
                    <span className="text-slate-400">:</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">&apos;Karthik S&apos;</span>
                    <span className="text-slate-400">,</span>
                    {'\n'}
                    {'  '}
                    <span className="text-sky-600 dark:text-sky-400">role</span>
                    <span className="text-slate-400">:</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">&apos;Software Developer&apos;</span>
                    <span className="text-slate-400">,</span>
                    {'\n'}
                    {'  '}
                    <span className="text-sky-600 dark:text-sky-400">focus</span>
                    <span className="text-slate-400">:</span>{' '}
                    <span className="text-slate-400">[</span>
                    <span className="text-emerald-600 dark:text-emerald-400">&apos;Backend&apos;</span>
                    <span className="text-slate-400">,</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">&apos;Cloud&apos;</span>
                    <span className="text-slate-400">],</span>
                    {'\n'}
                    {'  '}
                    <span className="text-sky-600 dark:text-sky-400">stack</span>
                    <span className="text-slate-400">:</span>{' '}
                    <span className="text-slate-400">[</span>
                    <span className="text-emerald-600 dark:text-emerald-400">&apos;Python&apos;</span>
                    <span className="text-slate-400">,</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">&apos;Node&apos;</span>
                    <span className="text-slate-400">,</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">&apos;AWS&apos;</span>
                    <span className="text-slate-400">],</span>
                    {'\n'}
                    {'  '}
                    <span className="text-sky-600 dark:text-sky-400">location</span>
                    <span className="text-slate-400">:</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">&apos;Bengaluru, IN&apos;</span>
                    <span className="text-slate-400">,</span>
                    {'\n'}
                    {'  '}
                    <span className="text-sky-600 dark:text-sky-400">available</span>
                    <span className="text-slate-400">:</span>{' '}
                    <span className="text-orange-600 dark:text-orange-400">true</span>
                    <span className="text-slate-400">,</span>
                    {'\n'}
                    <span className="text-slate-400">{'}'}</span>
                    <span className="text-slate-400">;</span>
                    {'\n'}
                    <span className="inline-block w-2 h-4 translate-y-0.5 bg-blue-500 animate-pulse"></span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
