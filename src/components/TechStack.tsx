import { Code2, Server, Cloud, Database, GitBranch } from 'lucide-react';

export function TechStack() {
  const categories = [
    {
      icon: Code2,
      title: 'Languages',
      gradient: 'from-blue-500 to-cyan-500',
      skills: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
    },
    {
      icon: Server,
      title: 'Backend & APIs',
      gradient: 'from-indigo-500 to-blue-600',
      skills: ['Node.js', 'Next.js', 'REST APIs'],
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      gradient: 'from-purple-500 to-pink-500',
      skills: ['AWS', 'Docker', 'CI/CD', 'Azure DevOps'],
    },
    {
      icon: Database,
      title: 'Databases',
      gradient: 'from-cyan-500 to-blue-600',
      skills: ['MySQL', 'MongoDB'],
    },
    {
      icon: GitBranch,
      title: 'OS & Tooling',
      gradient: 'from-blue-600 to-purple-600',
      skills: ['Linux', 'Shell Scripting', 'Git', 'Bitbucket'],
    },
  ];

  // Flat list for the scrolling "toolbelt" band.
  const allTools = Array.from(new Set(categories.flatMap((c) => c.skills)));

  return (
    <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 tracking-widest uppercase text-sm">What I Use</p>
          <h2 className="text-slate-900 dark:text-white text-4xl sm:text-5xl">Skills &amp; Tools</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">
            The technologies I reach for across backend engineering, cloud, and automation
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-700/40 hover:-translate-y-2"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-slate-900 dark:text-white text-xl">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-sm bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-600/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scrolling toolbelt band */}
        <div className="relative overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10"></div>

          <div className="flex">
            <div className="flex gap-3 animate-scroll whitespace-nowrap pr-3">
              {[...allTools, ...allTools].map((tool, index) => (
                <span
                  key={`${tool}-${index}`}
                  className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 shadow-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 28s linear infinite;
        }
      `}</style>
    </section>
  );
}
