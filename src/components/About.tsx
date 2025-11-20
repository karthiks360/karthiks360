import { Code, Cpu, Sparkles } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Code,
      title: 'Software Development',
      description: 'Develop custom software applications tailored to personal and business needs',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Sparkles,
      title: 'Technology Enthusiast',
      description: 'Passionate about exploring and learning new technologies and products',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Cpu,
      title: 'Electronics & Automation',
      description: 'Build electronic gadgets and automation projects, frequently upgrading and enhancing them',
      gradient: 'from-blue-600 to-purple-600',
    },
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <h2 className="text-slate-900 text-4xl sm:text-5xl">Let's Introduce About Myself</h2>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Passionate about creating innovative solutions and building exceptional digital experiences
          </p>
        </div>

        {/* Features Grid with Glass-morphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:-translate-y-2"
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
              
              <h3 className="text-slate-900 mb-3 text-xl">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
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
