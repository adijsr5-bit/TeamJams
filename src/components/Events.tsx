'use client';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Events() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchWithAuth('/events').then(setEvents).catch(console.error);
  }, []);

  const handleJoin = async (eventId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      await fetchWithAuth(`/events/${eventId}/join`, { method: 'POST' });
      alert('Successfully joined the drive!');
      // Refresh events
      fetchWithAuth('/events').then(setEvents);
    } catch (err: any) {
      alert(err.message || 'Error joining event');
    }
  };

  return (
    <section id="events" className="py-32 relative bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-light mb-6">
              Action starts <span className="text-brand-green">locally.</span>
            </h2>
            <p className="text-brand-muted text-lg">
              Find nearby cleanup drives, join local organizers, and help restore the city zone by zone.
            </p>
          </div>
          <button className="flex items-center gap-2 text-brand-green hover:text-white transition-colors font-semibold py-2">
            View Map <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length === 0 ? <p className="text-brand-muted">No upcoming events found.</p> : events.map((event: any) => (
            <div key={event._id} className="group glass-panel rounded-3xl overflow-hidden hover:border-brand-green/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col h-full">
              <div className="relative h-56 overflow-hidden bg-brand-slate">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-slate via-transparent to-transparent z-10" />
                {event.imageUrl ? (
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-green/10 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-brand-green/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 z-20 bg-brand-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-brand-green border border-brand-green/20">
                  {event.organizerName || 'Local NGO'}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-brand-light mb-4 line-clamp-2">{event.title}</h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-brand-muted text-sm">
                    <Calendar className="w-4 h-4 text-brand-green" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-brand-muted text-sm">
                    <MapPin className="w-4 h-4 text-brand-green" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-brand-light font-medium">{event.volunteersJoined?.length || 0} Joined</span>
                    <span className="text-brand-muted">Goal: {event.volunteersRequired}</span>
                  </div>
                  <div className="w-full bg-brand-slate rounded-full h-2 mb-6 overflow-hidden">
                    <div 
                      className="bg-brand-green h-2 rounded-full relative"
                      style={{ width: `${Math.min(((event.volunteersJoined?.length || 0) / event.volunteersRequired) * 100, 100)}%` }}
                    />
                  </div>
                  
                  <button 
                    onClick={() => handleJoin(event._id)}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-brand-green text-brand-light hover:text-white font-medium transition-all duration-300 border border-white/10 hover:border-transparent"
                  >
                    Join Drive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
