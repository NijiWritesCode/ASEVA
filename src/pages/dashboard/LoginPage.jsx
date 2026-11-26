import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/shared/Button';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, demoSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await signIn(email, password);
      if (authError) throw authError;
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication failure:', err);
      setError(err.message || 'Invalid staff credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    demoSignIn('owner');
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-xl font-bold text-obsidian-950">
          Staff Portal Access
        </h2>
        <p className="text-xs text-obsidian-600 mt-1">
          Authorized personnel only. Access is protected by audit logging.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-sm flex items-start text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Access Callout */}
      <div className="bg-gold-50/90 border border-gold-300 p-3.5 rounded-sm space-y-2 text-xs">
        <div className="flex items-center text-gold-900 font-semibold">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
          <span>Development & Reviewer Access</span>
        </div>
        <p className="text-[11px] text-obsidian-700 font-light leading-relaxed">
          Click below to authenticate as Lead Director (Folashade Adeleke) with full Owner permissions.
        </p>
        <Button
          variant="gold"
          size="sm"
          onClick={handleDemoSignIn}
          className="w-full shadow-sm"
        >
          Instant Director Access
        </Button>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-sand-300 w-full" />
        <span className="bg-white px-2 text-[10px] uppercase font-bold text-obsidian-400 absolute">
          Or Supabase Credentials
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-obsidian-800 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-obsidian-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@asevaevents.com"
              className="w-full pl-9 pr-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-sm text-xs focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-obsidian-800 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-obsidian-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-sm text-xs focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button variant="primary" size="md" type="submit" loading={loading} className="w-full">
            Authenticate Session
          </Button>
        </div>
      </form>
    </div>
  );
}
