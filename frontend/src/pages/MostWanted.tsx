import { useGetAllMostWanted } from '../hooks/useQueries';
import type { BackendMostWanted } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

const threatColors: Record<string, { border: string; text: string; bg: string }> = {
  'CRITICAL': { border: 'terminal-border-red', text: 'text-ops-red', bg: 'bg-ops-red/5' },
  'HIGH': { border: 'terminal-border-red', text: 'text-ops-red', bg: 'bg-ops-red/5' },
  'MEDIUM': { border: 'terminal-border-amber', text: 'text-ops-amber', bg: 'bg-ops-amber/5' },
  'LOW': { border: 'terminal-border', text: 'text-ops-green', bg: 'bg-ops-green/5' },
};

const statusStyles: Record<string, { text: string; label: string }> = {
  'At Large': { text: 'text-ops-red glow-red', label: '⚠ AT LARGE' },
  'Neutralized': { text: 'text-ops-amber', label: '✓ NEUTRALIZED' },
  'Captured': { text: 'text-ops-green', label: '⊘ CAPTURED' },
};

function WantedCard({ person }: { person: BackendMostWanted }) {
  const threat = threatColors[person.threatLevel] || threatColors['MEDIUM'];
  const status = statusStyles[person.status] || { text: 'text-ops-text-dim', label: person.status };

  return (
    <div
      className={`${threat.border} ${threat.bg} overflow-hidden hover:opacity-90 transition-opacity`}
      style={{
        backgroundImage: 'url(/assets/generated/wanted-bg.dim_800x600.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-ops-black/85 p-5 h-full">
        {/* Header */}
        <div className="text-center border-b border-ops-border pb-3 mb-3">
          <div className="font-orbitron text-[10px] tracking-[0.4em] text-ops-text-dim mb-1">W.R.A.I.T.H. DIVISION</div>
          <div className="font-orbitron text-xl font-black text-ops-red tracking-widest glow-red">MOST WANTED</div>
        </div>

        {/* Name */}
        <div className="text-center mb-4">
          <div className="font-orbitron text-lg font-black text-ops-text tracking-wider">{person.name}</div>
          {person.alias && (
            <div className="font-mono text-xs text-ops-text-dim mt-1">
              A.K.A. <span className="text-ops-amber italic">"{person.alias}"</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">THREAT LEVEL</span>
            <span className={`font-orbitron text-xs font-black tracking-widest ${threat.text}`}>
              {person.threatLevel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">LAST KNOWN LOC.</span>
            <span className="font-mono text-xs text-ops-text text-right max-w-[60%]">{person.lastKnownLocation}</span>
          </div>
          <div className="border-t border-ops-border pt-2">
            <div className="font-mono text-[10px] text-ops-text-dim tracking-widest mb-1">CHARGES</div>
            <p className="font-mono text-xs text-ops-text-dim leading-relaxed">{person.charges}</p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 pt-3 border-t border-ops-border text-center">
          <span className={`font-orbitron text-sm font-black tracking-widest ${status.text}`}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MostWanted() {
  const { data: wantedData, isLoading, error } = useGetAllMostWanted();
  const wanted = wantedData as BackendMostWanted[] | undefined;

  const atLarge = wanted?.filter(w => w.status === 'At Large') || [];
  const others = wanted?.filter(w => w.status !== 'At Large') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-ops-red/40" />
          <span className="font-mono text-[10px] text-ops-red/70 tracking-widest">THREAT DATABASE</span>
          <div className="h-px flex-1 bg-ops-red/40" />
        </div>
        <h1 className="font-orbitron text-3xl font-black text-ops-red glow-red tracking-widest text-center">
          MOST WANTED
        </h1>
        <p className="font-mono text-xs text-ops-text-dim text-center mt-2 tracking-widest">
          HIGH-VALUE TARGETS — AUTHORIZED NEUTRALIZATION APPROVED
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 bg-ops-card" />
          ))}
        </div>
      )}

      {error && (
        <div className="terminal-border-red bg-ops-red/10 p-6 text-center">
          <p className="font-mono text-ops-red text-sm tracking-widest">ERROR: UNABLE TO RETRIEVE THREAT DATA</p>
        </div>
      )}

      {!isLoading && !error && wanted && wanted.length === 0 && (
        <div className="terminal-border bg-ops-card p-12 text-center">
          <p className="font-mono text-ops-text-dim text-sm tracking-widest">NO ACTIVE THREATS ON RECORD</p>
        </div>
      )}

      {!isLoading && wanted && wanted.length > 0 && (
        <div className="space-y-10">
          {atLarge.length > 0 && (
            <div>
              <h2 className="font-orbitron text-sm font-bold text-ops-red tracking-widest mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-ops-red animate-pulse" />
                AT LARGE — ACTIVE THREATS ({atLarge.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {atLarge.map(p => <WantedCard key={p.id.toString()} person={p} />)}
              </div>
            </div>
          )}
          {others.length > 0 && (
            <div>
              <h2 className="font-orbitron text-sm font-bold text-ops-text-dim tracking-widest mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-ops-text-dim" />
                RESOLVED CASES ({others.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map(p => <WantedCard key={p.id.toString()} person={p} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
