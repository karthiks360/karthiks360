import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { TechStack } from '@/components/TechStack';
import { Projects } from '@/components/Projects';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { MouseGlowEffect } from '@/components/MouseGlowEffect';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
            <ParticleBackground />
            <MouseGlowEffect />
            <div className="relative z-10">
                <Navigation />
                <Hero />
                <TechStack />
                <About />
                <Projects />
                <Footer />
            </div>
        </div>
    );
}
