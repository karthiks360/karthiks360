import { ExternalLink, Github } from 'lucide-react';
import { Button } from './ui/button';

export function Projects() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and inventory management',
      tech: ['React', 'Node.js', 'MongoDB'],
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'AI Chat Assistant',
      description: 'Intelligent chatbot powered by machine learning for customer support',
      tech: ['Python', 'TensorFlow', 'FastAPI'],
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      title: 'IoT Dashboard',
      description: 'Real-time monitoring dashboard for IoT devices with data visualization',
      tech: ['React', 'WebSocket', 'PostgreSQL'],
      gradient: 'from-orange-600 to-red-600',
    },
  ];

  return (
    <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <h2 className="text-slate-900 text-4xl sm:text-5xl">Featured Projects</h2>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Some of my recent work and side projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group relative bg-white/60 backdrop-blur-lg rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:-translate-y-2"
            >
              {/* Gradient Header */}
              <div className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                {/* Abstract Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>
                
                {/* Project Number */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">0{index + 1}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-slate-900 text-2xl">{project.title}</h3>
                <p className="text-slate-600">{project.description}</p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl hover:bg-slate-50"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl hover:bg-slate-50"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live
                  </Button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
