import { useNavigate } from '@tanstack/react-router';
import { Shield, Target, Zap, Users, Briefcase, ChevronLeft, Lock } from 'lucide-react';
import { Agent, Mission, Asset, AgentStatus } from '../backend';
import { useGetAllAgents, useGetAllMissions, useGetAllAssets } from '../hooks/useQueries';

const divisions = [
  {
    name: 'Strike Operations',
    code: 'SO',
    description: 'Direct action units specializing in high-value target elimination and rapid assault operations.',
    icon: Target,
    clearance: 4,
  },
  {
    name: 'Tactical Support',
    code: 'TS',
    description: 'Logistics, intelligence relay, and field support for active strike teams.',
    icon: Zap,
    clearance: 3,
  },
  {
    name: 'Special Reconnaissance',
    code: 'SR',
    description: 'Long-range surveillance and pre-mission intelligence gathering in denied areas.',
    icon: Shield,
    clearance: 5,
  },
];

const keyFunctions = [
  'Direct Action (DA)',
  'Special Reconnaissance (SR)',
  'Counter-Terrorism (CT)',
  'Hostage Rescue (HR)',
  'High-Value Target (HVT) Operations',
  'Denied Area Penetration',
];

export default function DKSDepartment() {
  const navigate = useNavigate();

  const { data: allAgents = [], isLoading: agentsLoading } = useGetAllAgents();
  const { data: allMissions = [], isLoading: missionsLoading } = useGetAllMissions();
  const { data: allAssets = [], isLoading: assetsLoading } = useGetAllAssets();

  const dksAgents = (allAgents as Agent[]).filter(
    (a) => a.department === 'D.K.S.' && a.status !== AgentStatus.Banned && a.status !== AgentStatus.Kicked
  );
  const dksMissions = (allMissions as Mission[]).filter((m) => m.department === 'D.K.S.');
  const dksAssets = (allAssets as Asset[]).filter((a) => a.department === 'D.K.S.');

  const activeAgents = dksAgents.filter((a) => a.status === AgentStatus.Active);
  const activeMissions = dksMissions.filter((m) => m.status === 'Active');

  const isLoading = agentsLoading || missionsLoading || assetsLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <div className="relative border-b border-border bg-card overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(/assets/generated/classified-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-mono"
          >
            <ChevronLeft className="w-4 h-4" />
            BACK TO PORTAL
          </button>

          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded border-2 border-primary flex items-center justify-center bg-primary/10 shrink-0">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono text-primary tracking-widest uppercase">
                  W.R.A.I.T.H. Division
                </span>
                <span className="text-xs font-mono text-muted-foreground border border-border px-2 py-0.5 rounded">
                  CLEARANCE LVL 3+
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                D.K.S.
              </h1>
              <p className="text-lg text-muted-foreground font-mono">
                Directorate of Kinetic Solutions
              </p>
              <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
                The D.K.S. is W.R.A.I.T.H.'s primary direct-action arm, responsible for executing
                high-risk kinetic operations in denied environments. Personnel are drawn from elite
                special operations backgrounds and operate under strict compartmentalization protocols.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* Live Stats */}
        <section>
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">
            Live Statistics
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded p-4 animate-pulse h-20" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Personnel', value: dksAgents.length, icon: Users },
                { label: 'Active Agents', value: activeAgents.length, icon: Shield },
                { label: 'Active Missions', value: activeMissions.length, icon: Target },
                { label: 'Assets Assigned', value: dksAssets.length, icon: Briefcase },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <stat.icon className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-wide">{stat.label}</span>
                  </div>
                  <span className="text-3xl font-bold text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Operational Divisions */}
        <section>
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">
            Operational Divisions
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {divisions.map((div) => (
              <div
                key={div.code}
                className="bg-card border border-border rounded p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded border border-primary/40 bg-primary/10 flex items-center justify-center">
                      <div.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{div.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{div.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground border border-border px-2 py-0.5 rounded">
                    <Lock className="w-3 h-3" />
                    LVL {div.clearance}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{div.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Functions */}
        <section>
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">
            Key Functions
          </h2>
          <div className="bg-card border border-border rounded p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {keyFunctions.map((fn) => (
                <div key={fn} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {fn}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personnel */}
        <section>
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">
            Assigned Personnel
          </h2>
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded p-4 animate-pulse h-28" />
              ))}
            </div>
          ) : dksAgents.length === 0 ? (
            <div className="bg-card border border-border rounded p-8 text-center text-muted-foreground font-mono text-sm">
              NO PERSONNEL RECORDS FOUND
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {dksAgents.map((agent) => (
                <div
                  key={String(agent.id)}
                  className="bg-card border border-border rounded p-4 space-y-2"
                >
                  {agent.status === AgentStatus.Redacted ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-foreground/80 rounded w-3/4" />
                      <div className="h-3 bg-foreground/60 rounded w-1/2" />
                      <span className="text-xs font-mono text-destructive">REDACTED</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-foreground">{agent.codename}</p>
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded border ${
                            agent.status === AgentStatus.Active
                              ? 'text-green-400 border-green-400/40 bg-green-400/10'
                              : 'text-muted-foreground border-border'
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.officerTitle}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        CLR {String(agent.clearanceLevel)}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Operations */}
        <section>
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">
            Operations
          </h2>
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : dksMissions.length === 0 ? (
            <div className="bg-card border border-border rounded p-8 text-center text-muted-foreground font-mono text-sm">
              NO MISSION RECORDS FOUND
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {dksMissions.map((mission) => (
                <div
                  key={String(mission.id)}
                  className="bg-card border border-border rounded p-4 space-y-2"
                >
                  {mission.status === 'Redacted' ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-foreground/80 rounded w-3/4" />
                      <div className="h-3 bg-foreground/60 rounded w-1/2" />
                      <span className="text-xs font-mono text-destructive">REDACTED</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-foreground">{mission.title}</p>
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded border ${
                            mission.status === 'Active'
                              ? 'text-green-400 border-green-400/40 bg-green-400/10'
                              : 'text-muted-foreground border-border'
                          }`}
                        >
                          {mission.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {mission.classificationLevel} · {mission.date}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Assets */}
        <section>
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">
            Assigned Assets
          </h2>
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : dksAssets.length === 0 ? (
            <div className="bg-card border border-border rounded p-8 text-center text-muted-foreground font-mono text-sm">
              NO ASSET RECORDS FOUND
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {dksAssets.map((asset) => (
                <div
                  key={String(asset.id)}
                  className="bg-card border border-border rounded p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-foreground">{asset.name}</p>
                    <span className="text-xs font-mono text-muted-foreground border border-border px-2 py-0.5 rounded">
                      {asset.assetType}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{asset.status}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    CLR {String(asset.clearanceLevel)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
