'use client';
import { ShieldCheck, ArrowRight, Receipt, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchWithAuth, API_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Donations() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/campaigns/active`)
      .then(res => res.json())
      .then(data => setCampaign(data))
      .catch(console.error);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !campaign?._id) return;
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const uploadRes = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      
      if (uploadData.imageUrl) {
        const updatedGallery = [...(campaign.galleryImages || []), { url: uploadData.imageUrl, label: 'Impact' }];
        const updated = await fetchWithAuth(`/campaigns/${campaign._id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...campaign, galleryImages: updatedGallery })
        });
        setCampaign(updated);
        alert('Image uploaded successfully!');
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading image');
    }
  };

  const handleDonate = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsProcessing(true);
    try {
      // 1. Create order
      const order = await fetchWithAuth('/donations/order', {
        method: 'POST',
        body: JSON.stringify({ amount: 500 }) // Example amount: ₹500
      });
      
      // Load Razorpay Script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY',
          amount: order.amount,
          currency: order.currency,
          name: "TeamJams",
          description: "Donation for City Cleanup",
          order_id: order.id,
          handler: async function (response: any) {
            try {
              // 2. Verify payment on backend
              await fetchWithAuth('/donations/verify', {
                method: 'POST',
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  amount: 500
                })
              });
              alert('Donation successful! Thank you for your contribution.');
              // Refresh campaign stats
              fetch(`${API_URL}/campaigns/active`)
                .then(res => res.json())
                .then(data => setCampaign(data));
            } catch (err: any) {
              alert('Verification failed: ' + (err.message || 'Unknown error'));
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: "#10B981"
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsProcessing(false);
      };
      script.onerror = () => {
        alert('Razorpay SDK failed to load.');
        setIsProcessing(false);
      };
      document.body.appendChild(script);
      
    } catch (err: any) {
      alert(err.message || 'Error processing donation');
      setIsProcessing(false);
    }
  };

  return (
    <section id="donate" className="py-32 relative bg-brand-slate overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-green/30 bg-brand-green/10 mb-6">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span className="text-sm font-medium text-brand-green-light">100% Transparent</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-light mb-6">
            Every rupee <span className="text-brand-green">tracked.</span>
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            We believe in radical transparency. See exactly where community funds go, backed by receipts and verified impact photos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Financial Dashboard */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-8 md:p-10 border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-brand-light">{campaign?.title || 'Loading Campaign...'}</h3>
                <p className="text-brand-muted mt-1">Campaign active • Verified by Admin</p>
              </div>
              <button 
                onClick={handleDonate}
                disabled={isProcessing}
                className="bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] w-full md:w-auto disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Donate ₹500'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-brand-dark/50 rounded-2xl p-5 border border-white/5">
                <p className="text-brand-muted text-sm mb-1">Goal</p>
                <p className="text-2xl font-bold text-brand-light">₹{(campaign?.goal || 0).toLocaleString()}</p>
              </div>
              <div className="bg-brand-dark/50 rounded-2xl p-5 border border-white/5">
                <p className="text-brand-muted text-sm mb-1">Raised</p>
                <p className="text-2xl font-bold text-brand-green">₹{(campaign?.raised || 0).toLocaleString()}</p>
              </div>
              <div className="bg-brand-dark/50 rounded-2xl p-5 border border-white/5">
                <p className="text-brand-muted text-sm mb-1">Spent</p>
                <p className="text-2xl font-bold text-brand-light">₹{(campaign?.spent || 0).toLocaleString()}</p>
              </div>
              <div className="bg-brand-dark/50 rounded-2xl p-5 border border-white/5">
                <p className="text-brand-muted text-sm mb-1">Donors</p>
                <p className="text-2xl font-bold text-brand-light">{campaign?.donorsCount || 0}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-brand-light flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-muted" /> Expense Breakdown
              </h4>
              <div className="space-y-3">
                {[
                  { item: 'Garbage Bags & Gloves (200 sets)', amount: '₹4,500', date: 'Oct 15' },
                  { item: 'Refreshments for Volunteers', amount: '₹3,200', date: 'Oct 18' },
                  { item: 'Waste Transport Truck Hire', amount: '₹10,500', date: 'Oct 20' }
                ].map((expense, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-light font-medium truncate whitespace-normal sm:whitespace-nowrap">{expense.item}</p>
                      <p className="text-sm text-brand-muted">{expense.date}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-bold text-brand-light">{expense.amount}</span>
                      <button className="text-brand-green text-sm hover:underline flex items-center gap-1 whitespace-nowrap">
                        Receipt <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Proof Gallery */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-brand-light flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-brand-muted" /> Verified Impact Proof
                </h4>
                {user?.role?.toLowerCase() === 'admin' && (
                  <label className="bg-brand-green/20 hover:bg-brand-green/30 text-brand-green px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors border border-brand-green/30">
                    + Add Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {campaign?.galleryImages?.length > 0 ? (
                  campaign.galleryImages.map((img: any, idx: number) => (
                    <div key={idx} className={`space-y-2 ${idx === 2 ? 'col-span-2' : ''}`}>
                      <div className={`rounded-xl bg-brand-dark overflow-hidden relative group ${idx === 2 ? 'aspect-video' : 'aspect-square'}`}>
                        <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={img.label || 'Impact'} />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase">{img.label || 'IMPACT'}</div>
                      </div>
                    </div>
                  )).slice(0, 3)
                ) : (
                  <div className="col-span-2 text-center py-10 text-brand-muted text-sm border border-dashed border-white/10 rounded-xl">
                    Impact photos will appear here once uploaded by Admin.
                  </div>
                )}
              </div>
              <button className="w-full mt-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-brand-light transition-colors text-sm font-medium">
                View Full Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
