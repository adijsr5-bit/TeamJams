'use client';
import { Award, Star, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';

export default function Community() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/users/leaderboard`)
      .then(res => res.json())
      .then(data => setLeaders(data))
      .catch(console.error);
  }, []);

  const top3 = leaders.slice(0, 3);
  const remaining = leaders.slice(3, 10);

  return (
    <section id="community" className="py-32 relative bg-brand-slate">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-light mb-6">
            The people making it <span className="text-brand-green">happen.</span>
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Join thousands of citizens, students, and NGOs competing to make our city the cleanest in the country.
          </p>
        </div>

        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {top3.map((leader, idx) => (
            <div key={leader._id || idx} className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-dark relative z-10">
                  <img src={leader.img} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                {idx === 0 && (
                  <div className="absolute -top-3 -right-3 z-20 bg-brand-accent w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-4 h-4 text-brand-dark" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-brand-light mb-1">{leader.name}</h3>
              <div className="inline-flex items-center gap-1 text-brand-green text-sm font-semibold mb-6">
                <Award className="w-4 h-4" /> {leader.badge}
              </div>

              <div className="flex w-full justify-between px-4 py-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-light">{leader.hours}</p>
                  <p className="text-xs text-brand-muted font-medium uppercase tracking-wider mt-1">Hours</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-light">{leader.drives}</p>
                  <p className="text-xs text-brand-muted font-medium uppercase tracking-wider mt-1">Drives</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining 7 as a List */}
        {remaining.length > 0 && (
          <div className="max-w-4xl mx-auto bg-brand-dark/50 rounded-3xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-brand-light mb-4 px-4">More Top Contributors</h3>
            <div className="space-y-3">
              {remaining.map((leader, idx) => (
                <div key={leader._id || idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full font-bold text-brand-muted bg-white/5 flex items-center justify-center">
                      #{idx + 4}
                    </div>
                    <img src={leader.img} alt={leader.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                    <div>
                      <h4 className="text-brand-light font-bold">{leader.name}</h4>
                      <p className="text-xs text-brand-muted">{leader.badge}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-brand-light font-bold">{leader.hours}</p>
                      <p className="text-xs text-brand-muted">Hours</p>
                    </div>
                    <div>
                      <p className="text-brand-light font-bold">{leader.drives}</p>
                      <p className="text-xs text-brand-muted">Drives</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 p-10 rounded-3xl bg-gradient-to-br from-brand-green/20 to-brand-dark border border-brand-green/20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h3 className="text-2xl font-bold text-brand-light mb-3">Earn your Certificate</h3>
            <p className="text-brand-muted max-w-md">
              Complete your first 3 cleanup drives to unlock an officially verified volunteer certificate from our partner NGOs.
            </p>
          </div>
          <button className="bg-brand-light hover:bg-white text-brand-dark px-8 py-4 rounded-xl font-bold transition-all whitespace-nowrap">
            View My Profile
          </button>
        </div>
      </div>
    </section>
  );
}
