import { useGetAllAgents } from '../hooks/useQueries';
import type { BackendAgent } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

const rankSubtitles: Record<string, string> = {
  'Provisional Asset': 'Probationary',
  'Field Associate': 'Active Duty',
  'Senior Operative': 'Lead Specialist',
  'Principal Agent': 'Strategic Lead',
  'Ghost Lead': 'Section Chief',
};

const officerTitleFull: Record<string, string> = {
  'D.O.': 'Director of Operations',
  'C.S.': 'Chief of Section',
  'S.O.': 'Senior Officer',
  'T.O.': 'Technical Officer',
  'A.O.': 'Associate Officer',
};

const deptColors: Record<string, string> = {
  'G.O.S.': 'text-ops-red',
  'S.I.N.': 'text-ops-green',
  'T.A.C.': 'text-ops-amber',
  'V.O.I.D.': 'text-ops-green',
  'L.O.S.S.': 'text-ops-amber',
};

function AgentCard({ agent }: { agent: BackendAgent }) {
  const isRedacted = (agent.status as string) === 'Redacted';
  const subtitle = rankSubtitles[agent.rank] || '';
  const titleFull = officerTitleFull[agent.officerTitle] || agent.officerTitle;
  const deptColor = deptColors[agent.department] || 'text-ops-text';

  if (isRedacted) {
    return (
      <div className="terminal-border bg-ops-card p-5 opacity-80 relative overflow-hidden border-ops-red/40">
        {/* REDACTED stamp overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 rotate-[-15deg]">
          <span className="font-orbitron text-3xl font-black text-ops-red/25 tracking-[0.3em] border-4 border-ops-red/25 px-4 py-1 select-none">
            REDACTED
          </span>
        </div>

        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-orbitron text-lg font-bold text-ops-red tracking-wider">
              <span className="redacted-bar inline-block w-36 h-5 align-middle" />
            </div>
            <div className="font-mono text-xs text-ops-text-dim mt-0.5">
              <span className="redacted-bar inline-block w-24 h-3.5 align-middle" />
            </div>
          </div>
          <div className={`font-orbitron text-sm font-bold ${deptColor} tracking-widest`}>
            {agent.department}
          </div>
        </div>

        <div className="space-y-2 border-t border-ops-red/20 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">RANK</span>
            <div className="text-right">
              <span className="redacted-bar inline-block w-28 h-4 align-middle" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">OFFICER TITLE</span>
            <div className="text-right">
              <span className="redacted-bar inline-block w-20 h-4 align-middle" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">CLEARANCE</span>
            <span className="font-mono text-xs text-ops-red/60">██████████</span>
          </div>
          <div className="pt-2 border-t border-ops-red/20">
            <p className="font-mono text-xs text-ops-red/70 tracking-widest">
              [CONTENT REDACTED — CLEARANCE INSUFFICIENT]
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-border bg-ops-card p-5 hover:bg-ops-dark transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-orbitron text-lg font-bold text-ops-green glow-green tracking-wider">
            {agent.codename}
          </div>
          <div className="font-mono text-xs text-ops-text-dim mt-0.5">{agent.name}</div>
        </div>
        <div className={`font-orbitron text-sm font-bold ${deptColor} tracking-widest`}>
          {agent.department}
        </div>
      </div>

      <div className="space-y-2 border-t border-ops-border pt-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">RANK</span>
          <div className="text-right">
            <div className="font-rajdhani text-sm font-semibold text-ops-text">{agent.rank}</div>
            <div className="font-mono text-[10px] text-ops-amber tracking-wider">{subtitle}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">OFFICER TITLE</span>
          <div className="text-right">
            <span className="font-orbitron text-xs font-bold text-ops-green">{agent.officerTitle}</span>
            <div className="font-mono text-[10px] text-ops-text-dim">{titleFull}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">CLEARANCE</span>
          <span className="font-mono text-xs text-ops-amber">LEVEL {agent.clearanceLevel.toString()}</span>
        </div>
        {agent.bio && (
          <div className="pt-2 border-t border-ops-border">
            <p className="font-mono text-xs text-ops-text-dim leading-relaxed line-clamp-3">{agent.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Agents() {
  const { data: agents, isLoading, error } = useGetAllAgents();

  const activeAgents = (agents as BackendAgent[] | undefined)?.filter(a => (a.status as string) !== 'Redacted') || [];
  const redactedAgents = (agents as BackendAgent[] | undefined)?.filter(a => (a.status as string) === 'Redacted') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-ops-green-dim" />
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">PERSONNEL DOSSIERS</span>
          <div className="h-px flex-1 bg-ops-green-dim" />
        </div>
        <h1 className="font-orbitron text-3xl font-black text-ops-green glow-green tracking-widest text-center">
          ACTIVE AGENTS
        </h1>
        <p className="font-mono text-xs text-ops-text-dim text-center mt-2 tracking-widest">
          AUTHORIZED PERSONNEL ONLY — CLEARANCE REQUIRED
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 bg-ops-card" />
          ))}
        </div>
      )}

      {error && (
        <div className="terminal-border-red bg-ops-red/10 p-6 text-center">
          <p className="font-mono text-ops-red text-sm tracking-widest">ERROR: UNABLE TO RETRIEVE PERSONNEL DATA</p>
        </div>
      )}

      {!isLoading && !error && agents && (agents as BackendAgent[]).length === 0 && (
        <div className="terminal-border bg-ops-card p-12 text-center">
          <p className="font-mono text-ops-text-dim text-sm tracking-widest">NO ACTIVE AGENTS ON RECORD</p>
        </div>
      )}

      {!isLoading && agents && (agents as BackendAgent[]).length > 0 && (
        <div className="space-y-10">
          {activeAgents.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeAgents.map((agent) => (
                  <AgentCard key={agent.id.toString()} agent={agent} />
                ))}
              </div>
            </div>
          )}

          {redactedAgents.length > 0 && (
            <div>
              <h2 className="font-orbitron text-sm font-bold text-ops-red tracking-widest mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-ops-red" />
                REDACTED PERSONNEL ({redactedAgents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {redactedAgents.map((agent) => (
                  <AgentCard key={agent.id.toString()} agent={agent} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
