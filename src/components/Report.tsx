'use client';
import { Camera, MapPin, UploadCloud, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Report() {
  const [locationDetails, setLocationDetails] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      let uploadedImageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.imageUrl;
      }

      await fetchWithAuth('/reports', {
        method: 'POST',
        body: JSON.stringify({ locationDetails, description, imageUrl: uploadedImageUrl })
      });
      alert('Report submitted successfully! Admins will review it soon.');
      setLocationDetails('');
      setDescription('');
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      alert(err.message || 'Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="report" className="py-32 relative bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 mb-6">
              <AlertCircle className="w-4 h-4 text-brand-accent" />
              <span className="text-sm font-medium text-brand-accent">See dirt? Report it.</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-light mb-6">
              Spot a problem area? <br />
              <span className="text-brand-green">Drop a pin.</span>
            </h2>
            <p className="text-brand-muted text-lg mb-10">
              Your reports help NGOs and volunteers know where to focus next. Snap a photo, add the location, and we'll organize a drive.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-brand-light" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-light mb-1">1. Take a Photo</h4>
                  <p className="text-brand-muted">Capture the state of the area clearly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-light" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-light mb-1">2. Tag Location</h4>
                  <p className="text-brand-muted">Use GPS or drop a pin on the map.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5 text-brand-light" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-light mb-1">3. Submit for Review</h4>
                  <p className="text-brand-muted">Admins verify the report and create an event.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-white/10 relative">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-accent/20 blur-3xl rounded-full" />
            
            <h3 className="text-2xl font-bold text-brand-light mb-6">Report a Location</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="border-2 border-dashed border-white/20 hover:border-brand-green/50 transition-colors rounded-2xl h-40 flex flex-col items-center justify-center bg-white/5 cursor-pointer group relative overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-brand-muted group-hover:text-brand-green" />
                    </div>
                    <p className="text-sm font-medium text-brand-light">Tap to upload photo</p>
                    <p className="text-xs text-brand-muted mt-1">Max 5MB</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>

              <div>
                <label className="block text-sm font-medium text-brand-muted mb-2">Location details</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                  <input 
                    type="text" 
                    required
                    value={locationDetails}
                    onChange={e => setLocationDetails(e.target.value)}
                    placeholder="E.g., Near Sakchi Market Gate 3" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-brand-light focus:outline-none focus:border-brand-green/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-muted mb-2">Description (Optional)</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the severity or type of waste..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-brand-light focus:outline-none focus:border-brand-green/50 transition-colors resize-none"
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-brand-light hover:bg-white text-brand-dark px-8 py-4 rounded-xl font-bold transition-all mt-4 disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
