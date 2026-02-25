import { useState, useEffect } from 'react';
import { Lock, Terminal, ShieldAlert, Users, Target, Package, AlertTriangle, Building2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentManager from '../components/admin/AgentManager';
import MissionManager from '../components/admin/MissionManager';
import AssetManager from '../components/admin/AssetManager';
import MostWantedManager from '../components/admin/MostWantedManager';
import DepartmentManager from '../components/admin/DepartmentManager';

const ADMIN_PASSWORD = 'WRAITH123';
const SESSION_KEY = 'wraith_admin_auth';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setAttempts(a => a + 1);
      setError('ACCESS DENIED');
      setPassword('');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
    setPassword('');
  };

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Terminal header */}
          <div className="terminal-border bg-ops-dark p-6 scanline">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Lock className="h-12 w-12 text-ops-green glow-green" />
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <Lock className="h-12 w-12 text-ops-green" />
                  </div>
                </div>
              </div>
              <div className="font-orbitron text-xl font-black text-ops-green glow-green tracking-widest mb-1">
                SECURE ACCESS TERMINAL
              </div>
              <div className="font-mono text-[10px] text-ops-text-dim tracking-[0.3em]">
                W.R.A.I.T.H. ADMIN PANEL — CLASSIFIED
              </div>
            </div>

            {/* Terminal lines */}
            <div className="bg-ops-black border border-ops-green-dim p-4 mb-6 font-mono text-xs space-y-1">
              <div className="text-ops-green-dim">
                <span className="text-ops-green">$</span> INITIALIZING SECURE CHANNEL...
              </div>
              <div className="text-ops-green-dim">
                <span className="text-ops-green">$</span> ENCRYPTION: AES-256 ACTIVE
              </div>
              <div className="text-ops-green-dim">
                <span className="text-ops-green">$</span> AWAITING AUTHENTICATION...
                <span className="blink ml-1">█</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] text-ops-text-dim tracking-widest block mb-2">
                  ENTER ACCESS CODE:
                </label>
                <div className={`flex items-center border ${inputFocused ? 'border-ops-green' : 'border-ops-green-dim'} bg-ops-black transition-colors`}>
                  <span className="font-mono text-ops-green px-3 text-sm select-none">{'>'}</span>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="flex-1 bg-transparent font-mono text-sm text-ops-green py-3 pr-3 outline-none tracking-widest placeholder:text-ops-green-dim/40"
                    placeholder="••••••••"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="terminal-border-red bg-ops-red/10 p-3 text-center">
                  <div className="font-orbitron text-ops-red text-sm font-black tracking-widest glow-red">
                    ⚠ {error}
                  </div>
                  {attempts > 0 && (
                    <div className="font-mono text-[10px] text-ops-red/70 mt-1 tracking-widest">
                      FAILED ATTEMPTS: {attempts}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-ops-green/10 border border-ops-green text-ops-green font-orbitron text-sm font-bold tracking-widest py-3 hover:bg-ops-green/20 transition-colors"
              >
                AUTHENTICATE
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-mono text-[9px] text-ops-text-dim/50 tracking-widest">
                UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE — TITLE 50 U.S.C.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Admin Header */}
      <div className="terminal-border bg-ops-dark p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-ops-green" />
          <div>
            <div className="font-orbitron text-lg font-black text-ops-green tracking-widest">
              ADMIN CONTROL CENTER
            </div>
            <div className="font-mono text-[10px] text-ops-text-dim tracking-widest">
              FULL CREATOR ACCESS GRANTED — HANDLE WITH CARE
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-ops-green animate-pulse" />
            <span className="font-mono text-[10px] text-ops-green tracking-widest">AUTHENTICATED</span>
          </div>
          <button
            onClick={handleLogout}
            className="font-mono text-[10px] text-ops-red border border-ops-red/50 px-3 py-1.5 hover:bg-ops-red/10 tracking-widest transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="agents">
        <TabsList className="bg-ops-dark border border-ops-green-dim w-full justify-start mb-6 h-auto p-1 gap-1 flex-wrap">
          <TabsTrigger value="agents"
            className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-green/20 data-[state=active]:text-ops-green text-ops-text-dim flex items-center gap-1.5 px-4 py-2">
            <Users className="h-3 w-3" /> AGENTS
          </TabsTrigger>
          <TabsTrigger value="missions"
            className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-green/20 data-[state=active]:text-ops-green text-ops-text-dim flex items-center gap-1.5 px-4 py-2">
            <Terminal className="h-3 w-3" /> MISSIONS
          </TabsTrigger>
          <TabsTrigger value="assets"
            className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-green/20 data-[state=active]:text-ops-green text-ops-text-dim flex items-center gap-1.5 px-4 py-2">
            <Package className="h-3 w-3" /> ASSETS
          </TabsTrigger>
          <TabsTrigger value="most-wanted"
            className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-red/20 data-[state=active]:text-ops-red text-ops-text-dim flex items-center gap-1.5 px-4 py-2">
            <AlertTriangle className="h-3 w-3" /> MOST WANTED
          </TabsTrigger>
          <TabsTrigger value="departments"
            className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-green/20 data-[state=active]:text-ops-green text-ops-text-dim flex items-center gap-1.5 px-4 py-2">
            <Building2 className="h-3 w-3" /> DEPARTMENTS
          </TabsTrigger>
        </TabsList>

        <div className="terminal-border bg-ops-dark p-6">
          <TabsContent value="agents" className="mt-0">
            <AgentManager />
          </TabsContent>
          <TabsContent value="missions" className="mt-0">
            <MissionManager />
          </TabsContent>
          <TabsContent value="assets" className="mt-0">
            <AssetManager />
          </TabsContent>
          <TabsContent value="most-wanted" className="mt-0">
            <MostWantedManager />
          </TabsContent>
          <TabsContent value="departments" className="mt-0">
            <DepartmentManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
