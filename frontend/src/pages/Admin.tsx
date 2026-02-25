import { useState, useEffect } from 'react';
import { Lock, Terminal, ShieldAlert, Users, Target, Package, AlertTriangle, Building2, Crosshair } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentManager from '../components/admin/AgentManager';
import MissionManager from '../components/admin/MissionManager';
import AssetManager from '../components/admin/AssetManager';
import MostWantedManager from '../components/admin/MostWantedManager';
import DepartmentManager from '../components/admin/DepartmentManager';
import WeaponManager from '../components/admin/WeaponManager';

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
      setError(`ACCESS DENIED — INVALID CREDENTIALS [ATTEMPT ${attempts + 1}]`);
      setPassword('');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="terminal-border bg-ops-dark p-8 scanline">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert className="h-6 w-6 text-ops-red" />
              <div>
                <div className="font-orbitron text-ops-red text-sm font-bold tracking-widest">RESTRICTED ACCESS</div>
                <div className="font-mono text-ops-text-dim text-[10px] tracking-widest mt-0.5">ADMIN TERMINAL — AUTHENTICATION REQUIRED</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] text-ops-text-dim tracking-widest block mb-1">
                  ENTER ACCESS CODE
                </label>
                <div className={`flex items-center border ${inputFocused ? 'border-ops-green' : 'border-ops-border'} bg-ops-black transition-colors`}>
                  <Terminal className="h-3 w-3 text-ops-green ml-3 flex-shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="flex-1 bg-transparent px-3 py-2.5 font-mono text-sm text-ops-green outline-none tracking-widest"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="font-mono text-[10px] text-ops-red tracking-widest border border-ops-red/30 bg-ops-red/5 px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-ops-red/20 border border-ops-red text-ops-red font-mono text-xs tracking-widest py-2.5 hover:bg-ops-red/30 transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="h-3 w-3" />
                AUTHENTICATE
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-ops-border">
              <p className="font-mono text-[9px] text-ops-text-dim tracking-widest text-center">
                UNAUTHORIZED ACCESS ATTEMPTS ARE LOGGED AND PROSECUTED
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-orbitron text-2xl font-black text-ops-red tracking-widest">ADMIN TERMINAL</h1>
            <p className="font-mono text-xs text-ops-text-dim tracking-widest mt-1">W.R.A.I.T.H. OPERATIONS MANAGEMENT SYSTEM</p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthenticated(false); }}
            className="font-mono text-[10px] text-ops-text-dim tracking-widest border border-ops-border px-3 py-1.5 hover:border-ops-red hover:text-ops-red transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="bg-ops-dark border border-ops-border h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="agents" className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-green/20 data-[state=active]:text-ops-green flex items-center gap-1.5">
            <Users className="h-3 w-3" /> AGENTS
          </TabsTrigger>
          <TabsTrigger value="missions" className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-green/20 data-[state=active]:text-ops-green flex items-center gap-1.5">
            <Target className="h-3 w-3" /> MISSIONS
          </TabsTrigger>
          <TabsTrigger value="assets" className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-green/20 data-[state=active]:text-ops-green flex items-center gap-1.5">
            <Package className="h-3 w-3" /> ASSETS
          </TabsTrigger>
          <TabsTrigger value="weapons" className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-red/20 data-[state=active]:text-ops-red flex items-center gap-1.5">
            <Crosshair className="h-3 w-3" /> WEAPONS
          </TabsTrigger>
          <TabsTrigger value="most-wanted" className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-amber/20 data-[state=active]:text-ops-amber flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" /> MOST WANTED
          </TabsTrigger>
          <TabsTrigger value="departments" className="font-mono text-xs tracking-widest data-[state=active]:bg-ops-green/20 data-[state=active]:text-ops-green flex items-center gap-1.5">
            <Building2 className="h-3 w-3" /> DEPARTMENTS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="terminal-border bg-ops-dark p-6">
          <AgentManager />
        </TabsContent>
        <TabsContent value="missions" className="terminal-border bg-ops-dark p-6">
          <MissionManager />
        </TabsContent>
        <TabsContent value="assets" className="terminal-border bg-ops-dark p-6">
          <AssetManager />
        </TabsContent>
        <TabsContent value="weapons" className="terminal-border bg-ops-dark p-6">
          <WeaponManager />
        </TabsContent>
        <TabsContent value="most-wanted" className="terminal-border bg-ops-dark p-6">
          <MostWantedManager />
        </TabsContent>
        <TabsContent value="departments" className="terminal-border bg-ops-dark p-6">
          <DepartmentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
