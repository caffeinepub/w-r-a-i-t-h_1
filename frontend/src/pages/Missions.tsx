import { useGetAllMissions } from '../hooks/useQueries';
import type { BackendMission } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

const classificationColors: Record<string, string> = {
  'TOP SECRET': 'text-ops-red border-ops-red',
  'SECRET': 'text-ops-amber border-ops-amber',
  'CONFIDENTIAL': 'text-ops-green border-ops-green',
  'UNCLASSIFIED': 'text-ops-text-dim border-ops-border',
};

const statusColors: Record<string, string> = {
  'Active': 'text-ops-green',
  'Completed': 'text-ops-amber',
  'Redacted': 'text-ops-red',
};

function MissionCard({ mission }: { mission: BackendMission }) {
  const isRedacted = mission.status === 'Redacted';
  const classColor = classificationColors[mission.classificationLevel] || 'text-ops-text-dim border-ops-border';
  const statusColor = statusColors[mission.status] || 'text-ops-text-dim';

  return (
    <div className={`terminal-border bg-ops-card p-5 hover:bg-ops-dark transition-colors ${isRedacted ? 'opacity-80' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 mr-4">
          {isRedacted ? (
            <div className="font-orbitron text-lg font-bold text-ops-red tracking-wider">
              <span className="redacted-bar inline-block w-48 h-5" />
            </div>
          ) : (
            <div className="font-orbitron text-base font-bold text-ops-text tracking-wider">
              {mission.title}
            </div>
          )}
          <div className="font-mono text-xs text-ops-text-dim mt-0.5">{mission.department}</div>
        </div>
        <div className={`font-mono text-[10px] border px-2 py-0.5 tracking-widest ${classColor}`}>
          {mission.classificationLevel}
        </div>
      </div>

      <div className="space-y-2 border-t border-ops-border pt-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">STATUS</span>
          <span className={`font-orbitron text-xs font-bold tracking-wider ${statusColor}`}>
            {isRedacted ? '██████████' : mission.status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">DATE</span>
          <span className="font-mono text-xs text-ops-text">
            {isRedacted ? <span className="redacted-bar inline-block w-24 h-4" /> : mission.date}
          </span>
        </div>
        {mission.assignedAgents.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">ASSETS ASSIGNED</span>
            <span className="font-mono text-xs text-ops-green">
              {isRedacted ? '██' : mission.assignedAgents.length.toString()}
            </span>
          </div>
        )}
        {mission.description && !isRedacted && (
          <div className="pt-2 border-t border-ops-border">
            <p className="font-mono text-xs text-ops-text-dim leading-relaxed line-clamp-3">{mission.description}</p>
          </div>
        )}
        {isRedacted && (
          <div className="pt-2 border-t border-ops-border">
            <p className="font-mono text-xs text-ops-red/70 tracking-widest">
              [CONTENT REDACTED — CLEARANCE INSUFFICIENT]
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Missions() {
  const { data: missionsData, isLoading, error } = useGetAllMissions();
  const missions = missionsData as BackendMission[] | undefined;

  const active = missions?.filter(m => m.status === 'Active') || [];
  const completed = missions?.filter(m => m.status === 'Completed') || [];
  const redacted = missions?.filter(m => m.status === 'Redacted') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-ops-green-dim" />
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">MISSION DOSSIERS</span>
          <div className="h-px flex-1 bg-ops-green-dim" />
        </div>
        <h1 className="font-orbitron text-3xl font-black text-ops-green glow-green tracking-widest text-center">
          OPERATIONS LOG
        </h1>
        <p className="font-mono text-xs text-ops-text-dim text-center mt-2 tracking-widest">
          CLASSIFIED MISSION RECORDS — AUTHORIZED ACCESS ONLY
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
          <p className="font-mono text-ops-red text-sm tracking-widest">ERROR: UNABLE TO RETRIEVE MISSION DATA</p>
        </div>
      )}

      {!isLoading && !error && missions && missions.length === 0 && (
        <div className="terminal-border bg-ops-card p-12 text-center">
          <p className="font-mono text-ops-text-dim text-sm tracking-widest">NO MISSIONS ON RECORD</p>
        </div>
      )}

      {!isLoading && missions && missions.length > 0 && (
        <div className="space-y-10">
          {active.length > 0 && (
            <div>
              <h2 className="font-orbitron text-sm font-bold text-ops-green tracking-widest mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-ops-green animate-pulse" />
                ACTIVE OPERATIONS ({active.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map(m => <MissionCard key={m.id.toString()} mission={m} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="font-orbitron text-sm font-bold text-ops-amber tracking-widest mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-ops-amber" />
                COMPLETED OPERATIONS ({completed.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map(m => <MissionCard key={m.id.toString()} mission={m} />)}
              </div>
            </div>
          )}
          {redacted.length > 0 && (
            <div>
              <h2 className="font-orbitron text-sm font-bold text-ops-red tracking-widest mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-ops-red" />
                REDACTED OPERATIONS ({redacted.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {redacted.map(m => <MissionCard key={m.id.toString()} mission={m} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
