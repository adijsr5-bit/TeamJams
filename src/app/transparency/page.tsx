import Navbar from '@/components/Navbar';

export default function Transparency() {
  return (
    <main className="min-h-screen bg-brand-dark selection:bg-brand-green/30 selection:text-white pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-light mb-8">Transparency Policy</h1>
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 space-y-6 text-brand-muted text-lg leading-relaxed">
          <p>
            At TeamJams, radical transparency is at the core of what we do. We believe that when citizens donate their hard-earned money and time, they deserve to know exactly how it is used.
          </p>
          <h2 className="text-2xl font-bold text-brand-light mt-8 mb-4">Financial Transparency</h2>
          <p>
            Every rupee donated through our platform goes directly towards active campaigns. We publicly display the total amount raised, the total amount spent, and itemized expense breakdowns with attached receipts. We take 0% commission on donations.
          </p>
          <h2 className="text-2xl font-bold text-brand-light mt-8 mb-4">Impact Verification</h2>
          <p>
            We don't just rely on words. Our Verified Impact Proof system requires organizers to upload 'Before' and 'After' photos of cleanup sites, along with pictures of volunteers in action. This ensures that every completed project can be visually verified by the community.
          </p>
        </div>
      </div>
    </main>
  );
}
