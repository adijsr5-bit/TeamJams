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
      
      <footer className="bg-brand-dark py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-6">
          <div className="flex flex-wrap justify-center gap-4 text-brand-light font-medium text-sm">
            <a href="/about" className="hover:text-brand-green transition-colors">About</a>
            <span className="text-white/20">|</span>
            <a href="/contact" className="hover:text-brand-green transition-colors">Contact</a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-brand-muted text-sm">
            <a href="/privacy" className="hover:text-brand-light transition-colors">Privacy</a>
            <span className="text-white/20">|</span>
            <a href="/terms" className="hover:text-brand-light transition-colors">Terms</a>
            <span className="text-white/20">|</span>
            <a href="/transparency" className="hover:text-brand-light transition-colors">Transparency</a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-brand-muted text-sm">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors">Instagram</a>
            <span className="text-white/20">|</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors">LinkedIn</a>
          </div>
          
          <p className="text-brand-muted/60 text-sm mt-8">
            © 2026 TeamJams | Clean City Movement 🌱
          </p>
        </div>
      </footer>
    </main>
  );
}
