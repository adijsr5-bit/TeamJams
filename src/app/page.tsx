import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Events from '@/components/Events';
import Donations from '@/components/Donations';
import Report from '@/components/Report';
import Community from '@/components/Community';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark selection:bg-brand-green/30 selection:text-white">
      <Navbar />
      <Hero />
      <Events />
      <Donations />
      <Report />
      <Community />
      
      <footer className="bg-brand-dark py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-brand-muted font-medium">
            Team<span className="text-brand-green">Jams</span> © {new Date().getFullYear()}. Built for a cleaner city.
          </p>
        </div>
      </footer>
    </main>
  );
}
