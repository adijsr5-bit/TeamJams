import Navbar from '@/components/Navbar';

export default function Privacy() {
  return (
    <main className="min-h-screen bg-brand-dark selection:bg-brand-green/30 selection:text-white pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-light mb-8">Privacy Policy</h1>
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 space-y-6 text-brand-muted text-lg leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-2xl font-bold text-brand-light mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you register on TeamJams, we collect your name, email address, and optionally your phone number and profile image. We also track the events you participate in and the hours you contribute to generate your civic portfolio.
          </p>
          <h2 className="text-2xl font-bold text-brand-light mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            Your information is used to manage your account, track your volunteer hours, and display your public profile on our leaderboards. We do not sell your personal data to third parties.
          </p>
          <h2 className="text-2xl font-bold text-brand-light mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement standard security measures to protect your personal information. Passwords are encrypted, and financial transactions (donations) are processed securely via third-party gateways like Razorpay. We do not store your payment card details.
          </p>
        </div>
      </div>
    </main>
  );
}
