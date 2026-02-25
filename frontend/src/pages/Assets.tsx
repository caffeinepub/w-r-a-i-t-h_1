import { useGetAllAssets } from '../hooks/useQueries';
import type { BackendAsset } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

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
  'Compromised': 'text-ops-red',
  'Decommissioned': 'text-ops-text-dim',
};

function AssetCard({ asset }: { asset: BackendAsset }) {
  const clColor = clearanceLevelColors(asset.clearanceLevel);
  const statusColor = statusColors[asset.status] || 'text-ops-text-dim';

  return (
    <div className="terminal-border bg-ops-card p-5 hover:bg-ops-dark transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-orbitron text-base font-bold text-ops-text tracking-wider">{asset.name}</div>
          <div className="font-mono text-xs text-ops-text-dim mt-0.5">{asset.assetType}</div>
        </div>
        <div className={`font-mono text-[10px] border px-2 py-0.5 tracking-widest ${clColor}`}>
          CL-{asset.clearanceLevel.toString()}
        </div>
      </div>

      <div className="space-y-2 border-t border-ops-border pt-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">DEPARTMENT</span>
          <span className="font-orbitron text-xs font-bold text-ops-green">{asset.department}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">STATUS</span>
          <span className={`font-mono text-xs font-bold ${statusColor}`}>{asset.status}</span>
        </div>
        {asset.description && (
          <div className="pt-2 border-t border-ops-border">
            <p className="font-mono text-xs text-ops-text-dim leading-relaxed line-clamp-3">{asset.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Assets() {
  const { data: assetsData, isLoading, error } = useGetAllAssets();
  const assets = assetsData as BackendAsset[] | undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-ops-green-dim" />
          <span className="font-mono text-[10px] text-ops-text-dim tracking-widest">EQUIPMENT DOSSIERS</span>
          <div className="h-px flex-1 bg-ops-green-dim" />
        </div>
        <h1 className="font-orbitron text-3xl font-black text-ops-green glow-green tracking-widest text-center">
          ASSET REGISTRY
        </h1>
        <p className="font-mono text-xs text-ops-text-dim text-center mt-2 tracking-widest">
          CLASSIFIED EQUIPMENT & RESOURCE PROFILES
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 bg-ops-card" />
          ))}
        </div>
      )}

      {error && (
        <div className="terminal-border-red bg-ops-red/10 p-6 text-center">
          <p className="font-mono text-ops-red text-sm tracking-widest">ERROR: UNABLE TO RETRIEVE ASSET DATA</p>
        </div>
      )}

      {!isLoading && !error && assets && assets.length === 0 && (
        <div className="terminal-border bg-ops-card p-12 text-center">
          <p className="font-mono text-ops-text-dim text-sm tracking-widest">NO ASSETS ON RECORD</p>
        </div>
      )}

      {!isLoading && assets && assets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <AssetCard key={asset.id.toString()} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
