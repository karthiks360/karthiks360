import { PenLine, Rss } from 'lucide-react';

export function Blogs() {
  const upcoming = [
    'Designing scalable REST APIs for enterprise platforms',
    'Shipping to AWS with Docker and automated CI/CD',
    'Practical Linux automation with shell scripting',
  ];

  return (
    <section id="blogs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 tracking-widest uppercase text-sm">Writing</p>
          <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl">Blogs</h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">
            Notes on backend development, cloud, DevOps, and building AI-driven security platforms
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-10 sm:p-16 shadow-xl border border-white/20 dark:border-slate-700/40 text-center">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" aria-hidden="true"></div>

          <div className="relative z-10 space-y-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <PenLine className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-3">
              <h2 className="text-slate-900 dark:text-white text-2xl sm:text-3xl">Coming soon</h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                I&apos;m putting together in-depth articles from things I build and learn. Check back shortly — here&apos;s what&apos;s in the pipeline:
              </p>
            </div>

            {/* Upcoming topics */}
            <ul className="max-w-lg mx-auto space-y-3 text-left">
              {upcoming.map((topic) => (
                <li
                  key={topic}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/40 px-4 py-3"
                >
                  <Rss className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-700 dark:text-slate-200 text-sm">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
