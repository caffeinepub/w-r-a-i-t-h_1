import { useGetWeapons } from '../hooks/useQueries';
import type { BackendWeapon } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Crosshair } from 'lucide-react';

const clearanceLevelColors = (level: bigint): string => {
  const n = Number(level);
  if (n >= 5) return 'text-ops-red border-ops-red';
  if (n >= 4) return 'text-ops-amber border-ops-amber';
  if (n >= 3) return 'text-ops-green border-ops-green';
  return 'text-ops-text-dim border-ops-border';
};

const statusColors: Record<string, string> = {
  'Active': 'text-ops-green',
  'Inactive': 'text-ops-text-dim',
  'Deployed': 'text-ops-amber',
  'Decommissioned': 'text-ops-text-dim',
  'Restricted': 'text-ops-red',
  'Classified': 'text-ops-red',
};

function WeaponCard({ weapon }: { weapon: BackendWeapon }) {
  const clColor = clearanceLevelColors(weapon.clearanceLevel);
  const statusColor = statusColors[weapon.status] || 'text-ops-text-dim';

  return (
    <div className="terminal-border bg-ops-card p-5 hover:bg-ops-dark transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2">
          <Crosshair className="h-4 w-4 text-ops-red mt-0.5 flex-shrink-0 group-hover:text-ops-red opacity-70 group-hover:opacity-100 transition-opacity" />
          <div>
            <div className="font-orbitron text-base font-bold text-ops-text tracking-wider">{weapon.name}</div>
            <div className="font-mono text-xs text-ops-text-dim mt-0.5 tracking-widest">{weapon.weaponType}</div>
          </div>
        </div>
        <div className={`font-mono text-[10px] border px-2 py-0.5 tracking-widest flex-shrink-0 ${clColor}`}>
          CL-{weapon.clearanceLevel.toString()}
        </div>
      </div>

      <div className="space-y-2 border-t border-ops-border pt-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">DEPARTMENT</span>
          <span className="font-orbitron text-xs font-bold text-ops-green">{weapon.department}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">STATUS</span>
          <span className={`font-mono text-xs font-bold ${statusColor}`}>{weapon.status}</span>
        </div>
        {weapon.description && (
          <div className="pt-2 border-t border-ops-border">
            <p className="font-mono text-xs text-ops-text-dim leading-relaxed line-clamp-3">{weapon.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Weapons() {
  const { data: weaponsData, isLoading, error } = useGetWeapons();
  const weapons = weaponsData as BackendWeapon[] | undefined;

  // Group weapons by type
  const grouped = weapons
    ? weapons.reduce<Record<string, BackendWeapon[]>>((acc, w) => {
        const key = w.weaponType || 'Unclassified';
        if (!acc[key]) acc[key] = [];
        acc[key].push(w);
        return acc;
      }, {})
    : {};

  const groupKeys = Object.keys(grouped).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-ops-red/40" />
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">ARMORY DOSSIERS</span>
          <div className="h-px flex-1 bg-ops-red/40" />
        </div>
        <h1 className="font-orbitron text-3xl font-black text-ops-red tracking-widest text-center"
          style={{ textShadow: '0 0 20px oklch(0.55 0.22 25)' }}>
          WEAPONS REGISTRY
        </h1>
        <p className="font-mono text-xs text-ops-text-dim text-center mt-2 tracking-widest">
          CLASSIFIED ARMORY & ORDNANCE PROFILES
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 bg-ops-card" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="terminal-border-red bg-ops-red/10 p-6 text-center">
          <p className="font-mono text-ops-red text-sm tracking-widest">ERROR: UNABLE TO RETRIEVE WEAPONS DATA</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && weapons && weapons.length === 0 && (
        <div className="terminal-border bg-ops-card p-12 text-center">
          <Crosshair className="h-10 w-10 text-ops-text-dim mx-auto mb-4 opacity-30" />
          <p className="font-mono text-ops-text-dim text-sm tracking-widest">NO WEAPONS ON RECORD</p>
          <p className="font-mono text-ops-text-dim text-xs tracking-widest mt-2 opacity-60">ARMORY DATABASE EMPTY</p>
        </div>
      )}

      {/* Grouped weapons */}
      {!isLoading && weapons && weapons.length > 0 && (
        <div className="space-y-10">
          {groupKeys.map((type) => (
            <div key={type}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-ops-red/20" />
                <div className="flex items-center gap-2">
                  <Crosshair className="h-3 w-3 text-ops-red opacity-70" />
                  <span className="font-orbitron text-xs text-ops-red tracking-widest opacity-80">{type.toUpperCase()}</span>
                </div>
                <div className="h-px flex-1 bg-ops-red/20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[type].map((weapon) => (
                  <WeaponCard key={weapon.id.toString()} weapon={weapon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
