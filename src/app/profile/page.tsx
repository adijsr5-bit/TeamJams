'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchWithAuth, API_URL } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Clock, Award, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchWithAuth('/users/profile')
        .then(data => setProfileData(data))
        .catch(console.error);
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      const updatedProfile = await fetchWithAuth('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ avatarUrl: uploadData.imageUrl })
      });
      
      setProfileData(updatedProfile);
    } catch (err: any) {
      alert(err.message || 'Error uploading profile image');
    }
  };

  if (isLoading || !user) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-light">Loading...</div>;

  return (
    <div className="min-h-screen bg-brand-dark pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <div className="glass-panel rounded-3xl p-8 border border-white/10 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group w-24 h-24 rounded-full flex-shrink-0">
            {profileData?.avatarUrl ? (
              <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-brand-green/30" />
            ) : (
              <div className="w-full h-full rounded-full bg-brand-green/20 flex items-center justify-center text-4xl font-bold text-brand-green border-4 border-brand-green/30">
                {user.name.charAt(0)}
              </div>
            )}
            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium">
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-light">{user.name}</h1>
            <p className="text-brand-muted">{user.email} • {user.role.toUpperCase()}</p>
            {user.role?.toLowerCase() === 'admin' && (
              <button 
                onClick={() => router.push('/admin')}
                className="mt-4 bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-lg border border-brand-accent/20 font-medium text-sm hover:bg-brand-accent/20 transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Go to Admin Dashboard
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-brand-muted text-sm font-medium">Hours Contributed</p>
              <p className="text-3xl font-bold text-brand-light">{profileData?.hoursContributed || 0}</p>
            </div>
          </div>
          
          <div className="glass-panel rounded-3xl p-6 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <p className="text-brand-muted text-sm font-medium">Drives Joined</p>
              <p className="text-3xl font-bold text-brand-light">{profileData?.drivesJoined || 0}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-brand-light mb-6">Your Events</h2>
        <div className="space-y-4">
          {profileData?.events?.length > 0 ? (
            profileData.events.map((event: any) => (
              <div key={event._id} className="glass-panel rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-brand-light">{event.title}</h3>
                <p className="text-brand-muted text-sm">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
              </div>
            ))
          ) : (
            <div className="glass-panel rounded-2xl p-8 border border-white/10 text-center">
              <p className="text-brand-muted">You haven't joined any events yet.</p>
              <button 
                onClick={() => router.push('/#events')}
                className="mt-4 text-brand-green hover:underline"
              >
                Find an event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
