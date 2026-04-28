'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchWithAuth, API_URL } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'events' | 'reports' | 'campaigns'>('events');
  const [events, setEvents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  // Campaign State
  const [campaign, setCampaign] = useState<any>(null);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignGoal, setCampaignGoal] = useState(50000);
  const [campaignSpent, setCampaignSpent] = useState(0);

  // Attendance State
  const [activeAttendanceEvent, setActiveAttendanceEvent] = useState<string | null>(null);
  const [attendanceHours, setAttendanceHours] = useState<{ [key: string]: number }>({});

  // Create Event Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [volunteersRequired, setVolunteersRequired] = useState(100);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [campaignImageFile, setCampaignImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || (user.role?.toLowerCase() !== 'admin' && user.role?.toLowerCase() !== 'ngo'))) {
      router.push('/profile');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && (user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'ngo')) {
      fetchWithAuth('/events').then(setEvents).catch(console.error);
      if (user.role?.toLowerCase() === 'admin') {
        fetchWithAuth('/reports').then(setReports).catch(console.error);
        fetch(`${API_URL}/campaigns/active`)
          .then(res => res.json())
          .then(data => {
            setCampaign(data);
            setCampaignTitle(data.title);
            setCampaignGoal(data.goal);
            setCampaignSpent(data.spent);
          }).catch(console.error);
      }
    }
  }, [user]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.imageUrl;
      }

      const newEvent = await fetchWithAuth('/events', {
        method: 'POST',
        body: JSON.stringify({ title, description, date, location, volunteersRequired, imageUrl: uploadedImageUrl })
      });
      setEvents((prev: any) => [...prev, newEvent]);
      setTitle(''); setDescription(''); setDate(''); setLocation(''); setImageFile(null);
      alert('Event created successfully!');
    } catch (err: any) {
      alert(err.message || 'Error creating event');
    }
  };

  const handleApproveReport = async (report: any) => {
    try {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const newEvent = await fetchWithAuth('/events', {
        method: 'POST',
        body: JSON.stringify({ 
          title: `Cleanup Drive: ${report.locationDetails}`, 
          description: report.description || 'Community reported dirt area cleanup.', 
          date: nextWeek.toISOString().split('T')[0],
          location: report.locationDetails, 
          volunteersRequired: 50,
          imageUrl: report.imageUrl
        })
      });
      setEvents((prev: any) => [...prev, newEvent]);

      // Update report status in DB
      await fetchWithAuth(`/reports/${report._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'approved' })
      });
      // Remove from UI
      setReports((prev: any) => prev.filter((r: any) => r._id !== report._id));

      alert('Event created and report approved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error creating event from report');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetchWithAuth(`/events/${eventId}`, {
        method: 'DELETE'
      });
      setEvents((prev: any) => prev.filter((e: any) => e._id !== eventId));
    } catch (err: any) {
      alert(err.message || 'Error deleting event');
    }
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign?._id) return;
    try {
      let currentGallery = campaign.galleryImages || [];
      if (campaignImageFile) {
        const formData = new FormData();
        formData.append('image', campaignImageFile);
        const uploadRes = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.imageUrl) {
          currentGallery = [...currentGallery, { url: uploadData.imageUrl, label: 'Impact Proof' }];
        }
      }
      
      const updated = await fetchWithAuth(`/campaigns/${campaign._id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: campaignTitle, goal: campaignGoal, spent: campaignSpent, galleryImages: currentGallery })
      });
      setCampaign(updated);
      setCampaignImageFile(null);
      alert('Campaign updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Error updating campaign');
    }
  };

  const handleDeleteCampaignImage = async (imgUrl: string) => {
    if (!campaign?._id || !confirm('Delete this image?')) return;
    try {
      const currentGallery = campaign.galleryImages.filter((img: any) => img.url !== imgUrl);
      const updated = await fetchWithAuth(`/campaigns/${campaign._id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...campaign, galleryImages: currentGallery })
      });
      setCampaign(updated);
    } catch (err: any) {
      alert(err.message || 'Error deleting image');
    }
  };

  const handleCreditAttendance = async (eventId: string, userId: string) => {
    const hours = attendanceHours[`${eventId}-${userId}`] || 3;
    try {
      await fetchWithAuth(`/events/${eventId}/attendance`, {
        method: 'POST',
        body: JSON.stringify({ userId, hours })
      });
      alert(`Credited ${hours} hours successfully!`);
      // Update local state
      setEvents((prev: any) => prev.map((e: any) => {
        if (e._id === eventId) {
          return { ...e, attendedVolunteers: [...(e.attendedVolunteers || []), { user: { _id: userId } }] };
        }
        return e;
      }));
    } catch (err: any) {
      alert(err.message || 'Error crediting attendance');
    }
  };

  if (isLoading || !user) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-light">Loading...</div>;

  return (
    <div className="min-h-screen bg-brand-dark pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 pt-32">
        <h1 className="text-3xl font-bold text-brand-light mb-8">Admin Dashboard</h1>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'events' ? 'bg-brand-green text-white' : 'bg-white/5 text-brand-muted hover:text-brand-light'}`}
          >
            Manage Events
          </button>
          {user.role?.toLowerCase() === 'admin' && (
            <>
              <button 
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'reports' ? 'bg-brand-green text-white' : 'bg-white/5 text-brand-muted hover:text-brand-light'}`}
              >
                Review Reports
              </button>
              <button 
                onClick={() => setActiveTab('campaigns')}
                className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'campaigns' ? 'bg-brand-green text-white' : 'bg-white/5 text-brand-muted hover:text-brand-light'}`}
              >
                Manage Campaigns
              </button>
            </>
          )}
        </div>

        {activeTab === 'campaigns' && user.role?.toLowerCase() === 'admin' && (
          <div className="glass-panel rounded-3xl p-8 border border-white/10 max-w-2xl">
            <h2 className="text-xl font-bold text-brand-light mb-6">Manage Donation Campaign</h2>
            <form onSubmit={handleUpdateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-2">Campaign Title</label>
                <input type="text" value={campaignTitle} onChange={e => setCampaignTitle(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-2">Goal Amount (₹)</label>
                <input type="number" value={campaignGoal} onChange={e => setCampaignGoal(Number(e.target.value))} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-2">Spent Amount (₹)</label>
                <input type="number" value={campaignSpent} onChange={e => setCampaignSpent(Number(e.target.value))} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-brand-muted mb-2">Add Impact Image</label>
                <input type="file" accept="image/*" onChange={e => setCampaignImageFile(e.target.files?.[0] || null)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
              </div>

              {campaign?.galleryImages?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {campaign.galleryImages.map((img: any, idx: number) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-brand-dark/50 group">
                      <img src={img.url} alt="Campaign" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleDeleteCampaignImage(img.url)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="w-full bg-brand-green text-white py-3 rounded-xl font-bold mt-4">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel rounded-3xl p-8 border border-white/10 h-fit">
              <h2 className="text-xl font-bold text-brand-light mb-6">Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <input type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" rows={3}></textarea>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
                <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
                <input type="number" placeholder="Volunteers Required" value={volunteersRequired} onChange={e => setVolunteersRequired(Number(e.target.value))} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:border-brand-green/50 outline-none" />
                <button type="submit" className="w-full bg-brand-green text-white py-3 rounded-xl font-bold">Create Event</button>
              </form>
            </div>

            <div className="glass-panel rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-bold text-brand-light mb-6">Active Events</h2>
              <div className="space-y-4">
                {events.map((event: any) => (
                  <div key={event._id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-light">{event.title}</h3>
                        <p className="text-sm text-brand-muted">{event.location} • {new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-xs text-brand-green mt-2">{event.volunteersJoined?.length || 0} / {event.volunteersRequired} Joined</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleDeleteEvent(event._id)} className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-colors">
                          Delete
                        </button>
                        {activeAttendanceEvent === event._id ? (
                          <button onClick={() => setActiveAttendanceEvent(null)} className="text-brand-muted hover:text-brand-light text-sm font-medium px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            Close
                          </button>
                        ) : (
                          <button onClick={() => setActiveAttendanceEvent(event._id)} className="text-brand-accent hover:text-brand-light text-sm font-medium px-3 py-1 rounded-lg bg-brand-accent/10 hover:bg-brand-accent/20 transition-colors">
                            Attendance
                          </button>
                        )}
                      </div>
                    </div>
                    {activeAttendanceEvent === event._id && (
                      <div className="mt-2 p-4 bg-black/20 rounded-xl border border-white/5">
                        <h4 className="font-bold text-brand-light mb-3 text-sm">Credit Volunteer Hours</h4>
                        {event.volunteersJoined?.length === 0 ? <p className="text-sm text-brand-muted">No volunteers joined yet.</p> : (
                          <div className="space-y-3">
                            {event.volunteersJoined?.map((vol: any) => {
                              const isCredited = event.attendedVolunteers?.some((av: any) => av.user?._id === vol._id || av.user === vol._id);
                              return (
                                <div key={vol._id} className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-brand-light">{vol.name}</p>
                                    <p className="text-xs text-brand-muted">{vol.email}</p>
                                  </div>
                                  {isCredited ? (
                                    <span className="text-brand-green text-xs font-bold bg-brand-green/10 px-2 py-1 rounded-lg">CREDITED</span>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="number" 
                                        value={attendanceHours[`${event._id}-${vol._id}`] || 3} 
                                        onChange={e => setAttendanceHours(prev => ({ ...prev, [`${event._id}-${vol._id}`]: Number(e.target.value) }))}
                                        className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-brand-light text-sm outline-none focus:border-brand-accent"
                                        min="1"
                                      />
                                      <button 
                                        onClick={() => handleCreditAttendance(event._id, vol._id)}
                                        className="bg-brand-accent text-brand-dark px-3 py-1 rounded-lg text-xs font-bold hover:bg-brand-accent/80 transition-colors"
                                      >
                                        Approve
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="glass-panel rounded-3xl p-8 border border-white/10">
             <h2 className="text-xl font-bold text-brand-light mb-6">Submitted Dirt Reports</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.filter((r: any) => r.status !== 'approved').length === 0 ? <p className="text-brand-muted">No pending reports found.</p> : reports.filter((r: any) => r.status !== 'approved').map((report: any) => (
                  <div key={report._id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex gap-4">
                    {report.imageUrl && <img src={report.imageUrl} alt="Dirt report" className="w-24 h-24 rounded-lg object-cover" />}
                    <div className="flex-1">
                      <p className="font-bold text-brand-light mb-2">{report.locationDetails}</p>
                      <p className="text-sm text-brand-muted mb-4">{report.description}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveReport(report)} className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-green-dark transition-colors">Approve & Create Event</button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
