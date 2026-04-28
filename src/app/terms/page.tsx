import Navbar from '@/components/Navbar';

export default function Terms() {
  return (
    <main className="min-h-screen bg-brand-dark selection:bg-brand-green/30 selection:text-white pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-light mb-8">Terms of Service</h1>
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 space-y-6 text-brand-muted text-lg leading-relaxed">
          <h2 className="text-2xl font-bold text-brand-light mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TeamJams, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the platform.
          </p>
          <h2 className="text-2xl font-bold text-brand-light mt-8 mb-4">2. User Conduct</h2>
          <p>
            You agree to use the platform only for lawful purposes. You must not submit false reports of polluted areas or spam the platform with irrelevant content. TeamJams reserves the right to suspend accounts that violate community guidelines.
          </p>
          <h2 className="text-2xl font-bold text-brand-light mt-8 mb-4">3. Volunteering & Events</h2>
          <p>
            Participation in cleanup events is voluntary. TeamJams and partner NGOs are not liable for any injuries, losses, or damages that occur during physical volunteer events. Please take necessary safety precautions when handling waste.
          </p>
        </div>
      </div>
    </main>
  );
}
