import Navbar from '@/components/Navbar';

export default function Contact() {
  return (
    <main className="min-h-screen bg-brand-dark selection:bg-brand-green/30 selection:text-white pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-light mb-8">Contact Us</h1>
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 space-y-6">
          <p className="text-brand-muted text-lg">
            Have questions, suggestions, or want to partner with us? We'd love to hear from you.
          </p>
          <div className="space-y-4 text-brand-light mt-8">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-bold text-xl mb-2 text-brand-green">Email</h3>
              <p className="text-brand-muted">support@teamjams.org</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-bold text-xl mb-2 text-brand-green">Address</h3>
              <p className="text-brand-muted">123 Civic Center, Jamshedpur, Jharkhand 831001</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-bold text-xl mb-2 text-brand-green">Social Media</h3>
              <p className="text-brand-muted">Follow our journey on <a href="https://instagram.com" className="text-brand-light underline">Instagram</a> and <a href="https://linkedin.com" className="text-brand-light underline">LinkedIn</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
