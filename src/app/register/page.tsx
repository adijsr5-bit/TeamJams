'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchWithAuth } from '@/lib/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phoneNumber })
      });
      
      login({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }, data.token);
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 relative">
      <Link href="/" className="absolute top-8 left-8 text-brand-muted hover:text-brand-light transition-colors">
        ← Back to Home
      </Link>
      
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-light">Join the Movement</h1>
          <p className="text-brand-muted mt-2">Create an account to start contributing.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:outline-none focus:border-brand-green/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-2">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:outline-none focus:border-brand-green/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:outline-none focus:border-brand-green/50 transition-colors"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-brand-muted mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-brand-light focus:outline-none focus:border-brand-green/50 transition-colors"
              placeholder="+91..."
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm mt-8">
          Already have an account? <Link href="/login" className="text-brand-green hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
