import { useState } from 'react';
import { useGetAllAssets, useCreateAsset, useUpdateAsset, useDeleteAsset } from '../../hooks/useQueries';
import type { BackendAsset } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';

const DEPARTMENTS = ['G.O.S.', 'S.I.N.', 'T.A.C.', 'V.O.I.D.', 'L.O.S.S.'];
const ASSET_TYPES = ['Weapon', 'Vehicle', 'Technology', 'Intelligence', 'Personnel', 'Facility', 'Communication', 'Other'];
const STATUSES = ['Active', 'Inactive', 'Deployed', 'Compromised', 'Decommissioned'];

interface AssetFormData {
  name: string;
  assetType: string;
  department: string;
  status: string;
  description: string;
  clearanceLevel: string;
}

const emptyForm: AssetFormData = {
  name: '', assetType: 'Technology', department: 'G.O.S.',
  status: 'Active', description: '', clearanceLevel: '1',
};

export default function AssetManager() {
  const { data: assetsData, isLoading } = useGetAllAssets();
  const assets = assetsData as BackendAsset[] | undefined;

  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const deleteAsset = useDeleteAsset();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<BackendAsset | null>(null);
  const [form, setForm] = useState<AssetFormData>(emptyForm);

  const openCreate = () => {
    setEditingAsset(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (asset: BackendAsset) => {
    setEditingAsset(asset);
    setForm({
      name: asset.name,
      assetType: asset.assetType,
      department: asset.department,
      status: asset.status,
      description: asset.description,
      clearanceLevel: asset.clearanceLevel.toString(),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const data = {
      name: form.name,
      assetType: form.assetType,
      department: form.department,
      status: form.status,
      description: form.description,
      clearanceLevel: BigInt(parseInt(form.clearanceLevel) || 1),
    };
    if (editingAsset) {
      await updateAsset.mutateAsync({ id: editingAsset.id, ...data });
    } else {
      await createAsset.mutateAsync(data);
    }
    setDialogOpen(false);
  };

  const isPending = createAsset.isPending || updateAsset.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-lg font-bold text-ops-green tracking-widest">ASSET MANAGEMENT</h2>
        <Button onClick={openCreate} className="bg-ops-green/20 border border-ops-green text-ops-green hover:bg-ops-green/30 font-mono text-xs tracking-widest">
          <Plus className="h-3 w-3 mr-1" /> NEW ASSET
        </Button>
      </div>

      {isLoading && <div className="font-mono text-xs text-ops-text-dim tracking-widest">LOADING ASSET DATA...</div>}

      {!isLoading && assets && (
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-ops-green-dim text-ops-text-dim tracking-widest">
                <th className="text-left py-2 pr-4">NAME</th>
                <th className="text-left py-2 pr-4">TYPE</th>
                <th className="text-left py-2 pr-4">DEPT</th>
                <th className="text-left py-2 pr-4">STATUS</th>
                <th className="text-left py-2 pr-4">CL</th>
                <th className="text-left py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id.toString()} className="border-b border-ops-border hover:bg-ops-dark/50">
                  <td className="py-2 pr-4 text-ops-text">{asset.name}</td>
                  <td className="py-2 pr-4 text-ops-text-dim">{asset.assetType}</td>
                  <td className="py-2 pr-4 text-ops-amber">{asset.department}</td>
                  <td className="py-2 pr-4">
                    <span className={asset.status === 'Active' ? 'text-ops-green' : asset.status === 'Compromised' ? 'text-ops-red' : 'text-ops-text-dim'}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-ops-amber">L{asset.clearanceLevel.toString()}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(asset)}
                        className="h-6 px-2 text-ops-green hover:bg-ops-green/10">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-ops-red hover:bg-ops-red/10">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-ops-dark border-ops-red font-mono">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-orbitron text-ops-red">DELETE ASSET</AlertDialogTitle>
                            <AlertDialogDescription className="text-ops-text-dim">
                              Permanently delete asset <span className="text-ops-green">"{asset.name}"</span>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-ops-card border-ops-border text-ops-text-dim">CANCEL</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteAsset.mutate(asset.id)}
                              className="bg-ops-red/20 border border-ops-red text-ops-red hover:bg-ops-red/30">
                              CONFIRM DELETE
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-ops-text-dim tracking-widest">NO ASSETS ON RECORD</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-ops-dark border-ops-green-dim max-w-lg font-mono">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-ops-green tracking-widest">
              {editingAsset ? 'EDIT ASSET' : 'CREATE ASSET'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">ASSET NAME</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-text font-mono text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">TYPE</Label>
              <Select value={form.assetType} onValueChange={v => setForm(f => ({ ...f, assetType: v }))}>
                <SelectTrigger className="bg-ops-black border-ops-border text-ops-text font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ops-dark border-ops-border font-mono">
                  {ASSET_TYPES.map(t => <SelectItem key={t} value={t} className="text-ops-text text-xs">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">DEPARTMENT</Label>
              <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                <SelectTrigger className="bg-ops-black border-ops-border text-ops-text font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ops-dark border-ops-border font-mono">
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="text-ops-text text-xs">{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">STATUS</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="bg-ops-black border-ops-border text-ops-text font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ops-dark border-ops-border font-mono">
                  {STATUSES.map(s => <SelectItem key={s} value={s} className="text-ops-text text-xs">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">CLEARANCE LEVEL (1-5)</Label>
              <Input type="number" min="1" max="5" value={form.clearanceLevel}
                onChange={e => setForm(f => ({ ...f, clearanceLevel: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-amber font-mono text-xs" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">DESCRIPTION</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} className="bg-ops-black border-ops-border text-ops-text font-mono text-xs resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}
              className="font-mono text-xs text-ops-text-dim border border-ops-border hover:bg-ops-card">
              CANCEL
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}
              className="bg-ops-green/20 border border-ops-green text-ops-green hover:bg-ops-green/30 font-mono text-xs tracking-widest">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              {editingAsset ? 'UPDATE' : 'CREATE'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
