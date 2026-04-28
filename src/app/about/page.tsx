import Navbar from '@/components/Navbar';

export default function About() {
  return (
    <main className="min-h-screen bg-brand-dark selection:bg-brand-green/30 selection:text-white pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-light mb-8">About TeamJams</h1>
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 space-y-6 text-brand-muted text-lg leading-relaxed">
          <p>
            TeamJams is a civic movement dedicated to making Jamshedpur the cleanest city in India. We believe that real change starts at the grassroots level, driven by citizens who care about their community.
          </p>
          <p>
            Our platform connects volunteers, NGOs, and local authorities to organize cleanup drives, report polluted areas, and transparently fund restoration projects. By gamifying civic duty and providing a centralized hub for environmental action, we make it easy for everyone to contribute.
          </p>
          <h2 className="text-2xl font-bold text-brand-light mt-8 mb-4">Our Mission</h2>
          <p>
            To empower every citizen with the tools and community support needed to take ownership of their local environment, transforming polluted spaces into clean, thriving ecosystems.
          </p>
        </div>
      </div>
    </main>
  );
}
