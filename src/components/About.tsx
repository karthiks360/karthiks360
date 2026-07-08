import {
  Code2,
  Cloud,
  TerminalSquare,
  MapPin,
  Building2,
  Clock,
  GraduationCap,
  Sparkles,
  Workflow,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Code2,
      title: 'Backend & API Engineering',
      description: 'Design and build scalable backend services and REST APIs in Python, Node.js, and Next.js for production environments',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'Deploy and operate applications on AWS (EC2, Lambda) with Docker, Git, and automated CI/CD deployment workflows',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: TerminalSquare,
      title: 'Infrastructure & Automation',
      description: 'Automate operations and monitoring on Linux with shell scripting, improving efficiency and reducing manual effort',
      gradient: 'from-blue-600 to-purple-600',
    },
  ];

  const profile = [
    { icon: MapPin, label: 'Location', value: 'Bengaluru, India' },
    { icon: Building2, label: 'Currently', value: 'SISA · AI Prism platform' },
    { icon: Clock, label: 'Experience', value: '4+ years' },
    { icon: GraduationCap, label: 'Education', value: 'M.Tech, Computer Networks' },
  ];

  const principles = [
    {
      icon: Sparkles,
      title: 'Clean & maintainable',
      description: 'Readable, well-structured code that is easy to extend, test, and hand off.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Workflow,
      title: 'Automation-first',
      description: 'Automate the repetitive — deployments, monitoring, and ops — to cut manual toil.',
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      icon: ShieldCheck,
      title: 'Ownership & reliability',
      description: 'End-to-end ownership from design to deployment, with reliability built in.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Always learning',
      description: 'Continuously exploring new tools, cloud services, and security practices.',
      gradient: 'from-blue-600 to-purple-600',
    },
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 tracking-widest uppercase text-sm">Who I Am</p>
          <h2 className="text-slate-900 dark:text-white text-4xl sm:text-5xl">About Me</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">
            A software developer focused on backend development, cloud deployment, and infrastructure automation — turning complex requirements into reliable, production-ready systems
          </p>
        </div>

        {/* Bio + Profile Spec Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Narrative */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-slate-900 dark:text-white text-2xl">My Story</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                I&apos;m a software developer based in Bengaluru, India, with 4+ years of experience
                building backend services, REST APIs, and cloud infrastructure for production
                environments.
              </p>
              <p>
                Today I&apos;m at <span className="text-slate-900 dark:text-white">SISA</span>, where I
                help build AI-driven enterprise security platforms — owning backend services, database
                design, and deployment automation across the full software development lifecycle.
              </p>
              <p>
                My earlier work spans automotive ADAS at Bosch and production software teams, where I
                focused on automation, monitoring, and making systems more reliable. I care about clean,
                maintainable code and eliminating manual toil through smart automation.
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/40">
              <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-6">{'// profile'}</p>
              <ul className="space-y-5">
                {profile.map((item) => (
                  <li key={item.label} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60">
                      <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.label}</p>
                      <p className="text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* What I Do */}
        <div className="space-y-8">
          <h3 className="text-slate-900 dark:text-white text-2xl text-center">What I Do</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-700/40 hover:-translate-y-2"
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>

                {/* Icon Container with Glow */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>

                <h4 className="text-slate-900 dark:text-white mb-3 text-xl">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How I Work */}
        <div className="space-y-8">
          <h3 className="text-slate-900 dark:text-white text-2xl text-center">How I Work</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-700/40 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${principle.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-4`}>
                  <principle.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-slate-900 dark:text-white mb-2 text-lg">{principle.title}</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Banner with Motion Patterns */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-12 sm:p-16 text-white text-center shadow-2xl">
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10 space-y-3">
            <p className="text-2xl sm:text-3xl lg:text-4xl">
              Always staying on the cutting edge of technology
            </p>
            <p className="text-blue-100 text-lg sm:text-xl">
              Building innovative solutions and continuously learning
            </p>
          </div>

          {/* Decorative Lines */}
          <div className="absolute top-10 left-10 w-20 h-1 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
