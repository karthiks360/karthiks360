import Link from 'next/link';
import { ArrowRight, User, Layers, Briefcase, PenLine } from 'lucide-react';

const cards = [
  {
    href: '/about',
    icon: User,
    title: 'About Me',
    description: 'Backend, cloud, and infrastructure automation — how I turn requirements into reliable systems.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/skills',
    icon: Layers,
    title: 'Skills & Tools',
    description: 'The stack I work with daily — Python, Node.js, Next.js, AWS, Docker, Linux, and more.',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    href: '/experience',
    icon: Briefcase,
    title: 'Experience',
    description: '4+ years across enterprise security, automotive ADAS, and production software teams.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    href: '/blogs',
    icon: PenLine,
    title: 'Blogs',
    description: 'Notes on backend, cloud, and DevOps from the things I build and learn.',
    gradient: 'from-blue-600 to-purple-600',
  },
];

export function HomeHighlights() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 tracking-widest uppercase text-sm">Explore</p>
          <h2 className="text-slate-900 dark:text-white text-4xl sm:text-5xl">Dive Deeper</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">
            A closer look at what I do, the tools I use, and where I&apos;ve worked
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-700/40 hover:-translate-y-2"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>

              <div className="relative flex items-center gap-5">
                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-slate-900 dark:text-white text-xl">
                    {card.title}
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:translate-x-1" />
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
