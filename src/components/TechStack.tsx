export function TechStack() {
  const technologies = [
    { name: 'React', color: 'from-cyan-500 to-blue-500' },
    { name: 'TypeScript', color: 'from-blue-600 to-blue-700' },
    { name: 'Node.js', color: 'from-green-600 to-green-700' },
    { name: 'Python', color: 'from-blue-500 to-yellow-500' },
    { name: 'Docker', color: 'from-blue-500 to-cyan-600' },
    { name: 'AWS', color: 'from-orange-500 to-yellow-500' },
    { name: 'PostgreSQL', color: 'from-blue-600 to-blue-800' },
    { name: 'MongoDB', color: 'from-green-600 to-green-800' },
    { name: 'Git', color: 'from-orange-600 to-red-600' },
    { name: 'Linux', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-slate-900 text-4xl sm:text-5xl mb-4">Tech Stack & Tools</h2>
        <p className="text-slate-600 text-lg">Technologies I work with daily</p>
      </div>

      {/* Scrolling Container */}
      <div className="relative overflow-hidden">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>

        {/* Scrolling Tech Tags */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-4 animate-scroll">
            {technologies.map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="flex-shrink-0 group"
              >
                <div className={`px-8 py-4 bg-gradient-to-r ${tech.color} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
                  <span className="text-white text-lg whitespace-nowrap">{tech.name}</span>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop effect */}
            {technologies.map((tech, index) => (
              <div
                key={`${tech.name}-duplicate-${index}`}
                className="flex-shrink-0 group"
              >
                <div className={`px-8 py-4 bg-gradient-to-r ${tech.color} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
                  <span className="text-white text-lg whitespace-nowrap">{tech.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
