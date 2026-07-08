import { Briefcase, GraduationCap, Award } from 'lucide-react';

export function Experience() {
  const roles = [
    {
      company: 'SISA',
      title: 'Associate Consultant Engineer',
      period: 'Jan 2025 – Present',
      location: 'Bengaluru, India · Hybrid',
      points: [
        'Collaborating and leading the development team on the AI Prism platform across the full software development lifecycle.',
        'Build scalable backend services and REST APIs for AI-driven enterprise security applications.',
        'Own database design, optimization, and backend integration workflows for production environments.',
        'Drive end-to-end cloud deployment and DevOps automation across backend, API, and infrastructure workflows.',
      ],
    },
    {
      company: 'Bosch Global Software Technologies',
      title: 'Student Trainee — ADAS',
      period: 'Nov 2023 – Aug 2024',
      location: 'Bengaluru, India',
      points: [
        'Worked on advanced parking-function features for the Advanced Driver Assistance Systems (ADAS) team.',
        'Innovated and integrated a hardware proof of concept for a parking function using a single camera.',
        'Designed and developed a Mini SLAM video simulator for high-speed mapping and processing.',
        'Enhanced sensor fusion and perception algorithms to improve parking accuracy and efficiency.',
      ],
    },
    {
      company: 'Modus Information Systems',
      title: 'Software Engineer',
      period: 'Apr 2021 – Mar 2023',
      location: 'Bengaluru, India · Hybrid',
      points: [
        'Led migration of a new core payments system and optimized NEFT/RTGS batch jobs.',
        'Maintained banking API integrations with third-party fintechs and automated EOD/BOD operations.',
        'Worked on customization and development of banking application features.',
      ],
    },
  ];

  const education = [
    {
      school: 'RV College of Engineering',
      degree: 'M.Tech, Computer Networks Engineering',
      period: '2023 – 2024',
    },
    {
      school: 'Sri Siddhartha Institute of Technology',
      degree: 'B.E., Electronics & Communication',
      period: '2016 – 2020',
    },
  ];

  const achievements = [
    'Winner — SISA Sapper: Code Commandos CTF 2025',
    'Best Project Award — RV College of Engineering (M.Tech 2024)',
  ];

  return (
    <section id="experience" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 tracking-widest uppercase text-sm">Where I&apos;ve Worked</p>
          <h2 className="text-slate-900 dark:text-white text-4xl sm:text-5xl">Experience</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">
            4+ years across enterprise security, automotive ADAS, and production software teams
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/60 via-purple-500/40 to-transparent sm:-translate-x-1/2" aria-hidden="true" />

          <div className="space-y-10">
            {roles.map((role, index) => (
              <div
                key={role.company}
                className="relative sm:grid sm:grid-cols-2 sm:gap-12"
              >
                {/* Node */}
                <div className="absolute left-4 sm:left-1/2 top-6 w-3 h-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-white dark:ring-slate-950" aria-hidden="true" />

                <div className={`pl-12 sm:pl-0 ${index % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:col-start-2 sm:pl-12'}`}>
                  <div className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-slate-700/40 hover:-translate-y-1">
                    <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? 'sm:justify-end' : ''}`}>
                      <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-blue-600 dark:text-blue-400">{role.period}</span>
                    </div>
                    <h3 className="text-slate-900 dark:text-white text-xl">{role.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {role.company} · {role.location}
                    </p>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm text-left">
                      {role.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-purple-500 flex-shrink-0" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-slate-900 dark:text-white text-xl">Education</h3>
            </div>
            <ul className="space-y-4">
              {education.map((edu) => (
                <li key={edu.school}>
                  <p className="text-slate-900 dark:text-white">{edu.degree}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {edu.school} · {edu.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-slate-900 dark:text-white text-xl">Achievements</h3>
            </div>
            <ul className="space-y-4">
              {achievements.map((achievement) => (
                <li key={achievement} className="flex gap-3 text-slate-600 dark:text-slate-300">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" aria-hidden="true" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
