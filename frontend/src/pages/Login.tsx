import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api.service';
import { Lock, Mail, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-lg border border-border card-gradient shadow-2xl"
      >
        <div className="flex items-center justify-center mb-8 gap-2">
          <Server className="text-neon-green w-8 h-8" />
          <h1 className="text-3xl font-mono tracking-tighter text-white">API<span className="text-neon-green">CENTER</span></h1>
        </div>

        <h2 className="text-xl mb-6 text-center font-mono text-slate-400 uppercase tracking-widest">System Access</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-500 uppercase">Credential: Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
              <input
                type="email"
                required
                className="w-full bg-black/50 border border-border rounded p-3 pl-10 text-white focus:outline-none focus:border-neon-green transition-colors font-mono"
                placeholder="admin@apicenter.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-500 uppercase">Credential: Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
              <input
                type="password"
                required
                className="w-full bg-black/50 border border-border rounded p-3 pl-10 text-white focus:outline-none focus:border-neon-green transition-colors font-mono"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="p-3 bg-red-900/20 border border-red-500/50 text-neon-red text-sm font-mono rounded"
            >
              [ERROR]: {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-transparent border border-neon-green text-neon-green hover:bg-neon-green/10 py-3 rounded font-mono uppercase tracking-widest transition-all neon-glow-green disabled:opacity-50"
          >
            {isLoading ? 'Decrypting Access...' : 'Execute Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-mono text-slate-500">
          No secure ID? <Link to="/register" className="text-neon-green hover:underline">Register New Node</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
