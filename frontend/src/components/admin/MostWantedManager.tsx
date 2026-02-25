import { useState } from 'react';
import { useGetAllMostWanted, useCreateMostWanted, useUpdateMostWanted, useDeleteMostWanted } from '../../hooks/useQueries';
import type { BackendMostWanted } from '../../hooks/useQueries';
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

const THREAT_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES = ['At Large', 'Neutralized', 'Captured'];

interface MostWantedFormData {
  name: string;
  alias: string;
  threatLevel: string;
  lastKnownLocation: string;
  charges: string;
  status: string;
}

const emptyForm: MostWantedFormData = {
  name: '', alias: '', threatLevel: 'HIGH',
  lastKnownLocation: '', charges: '', status: 'At Large',
};

export default function MostWantedManager() {
  const { data: wantedData, isLoading } = useGetAllMostWanted();
  const wanted = wantedData as BackendMostWanted[] | undefined;

  const createMostWanted = useCreateMostWanted();
  const updateMostWanted = useUpdateMostWanted();
  const deleteMostWanted = useDeleteMostWanted();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<BackendMostWanted | null>(null);
  const [form, setForm] = useState<MostWantedFormData>(emptyForm);

  const openCreate = () => {
    setEditingPerson(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (person: BackendMostWanted) => {
    setEditingPerson(person);
    setForm({
      name: person.name,
      alias: person.alias,
      threatLevel: person.threatLevel,
      lastKnownLocation: person.lastKnownLocation,
      charges: person.charges,
      status: person.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const data = {
      name: form.name,
      alias: form.alias,
      threatLevel: form.threatLevel,
      lastKnownLocation: form.lastKnownLocation,
      charges: form.charges,
      status: form.status,
    };
    if (editingPerson) {
      await updateMostWanted.mutateAsync({ id: editingPerson.id, ...data });
    } else {
      await createMostWanted.mutateAsync(data);
    }
    setDialogOpen(false);
  };

  const isPending = createMostWanted.isPending || updateMostWanted.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-lg font-bold text-ops-red tracking-widest">MOST WANTED MANAGEMENT</h2>
        <Button onClick={openCreate} className="bg-ops-red/20 border border-ops-red text-ops-red hover:bg-ops-red/30 font-mono text-xs tracking-widest">
          <Plus className="h-3 w-3 mr-1" /> ADD TARGET
        </Button>
      </div>

      {isLoading && <div className="font-mono text-xs text-ops-text-dim tracking-widest">LOADING THREAT DATA...</div>}

      {!isLoading && wanted && (
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-ops-green-dim text-ops-text-dim tracking-widest">
                <th className="text-left py-2 pr-4">NAME</th>
                <th className="text-left py-2 pr-4">ALIAS</th>
                <th className="text-left py-2 pr-4">THREAT</th>
                <th className="text-left py-2 pr-4">LOCATION</th>
                <th className="text-left py-2 pr-4">STATUS</th>
                <th className="text-left py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {wanted.map((person) => (
                <tr key={person.id.toString()} className="border-b border-ops-border hover:bg-ops-dark/50">
                  <td className="py-2 pr-4 text-ops-text font-bold">{person.name}</td>
                  <td className="py-2 pr-4 text-ops-amber italic">"{person.alias}"</td>
                  <td className="py-2 pr-4">
                    <span className={person.threatLevel === 'CRITICAL' || person.threatLevel === 'HIGH' ? 'text-ops-red' : person.threatLevel === 'MEDIUM' ? 'text-ops-amber' : 'text-ops-green'}>
                      {person.threatLevel}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-ops-text-dim">{person.lastKnownLocation}</td>
                  <td className="py-2 pr-4">
                    <span className={person.status === 'At Large' ? 'text-ops-red' : person.status === 'Neutralized' ? 'text-ops-amber' : 'text-ops-green'}>
                      {person.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(person)}
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
                            <AlertDialogTitle className="font-orbitron text-ops-red">DELETE TARGET</AlertDialogTitle>
                            <AlertDialogDescription className="text-ops-text-dim">
                              Remove <span className="text-ops-green">{person.name}</span> from the Most Wanted list?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-ops-card border-ops-border text-ops-text-dim">CANCEL</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMostWanted.mutate(person.id)}
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
              {wanted.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-ops-text-dim tracking-widest">NO TARGETS ON RECORD</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-ops-dark border-ops-red/50 max-w-lg font-mono">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-ops-red tracking-widest">
              {editingPerson ? 'EDIT TARGET' : 'ADD TARGET'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">FULL NAME</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-text font-mono text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">ALIAS / A.K.A.</Label>
              <Input value={form.alias} onChange={e => setForm(f => ({ ...f, alias: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-amber font-mono text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">THREAT LEVEL</Label>
              <Select value={form.threatLevel} onValueChange={v => setForm(f => ({ ...f, threatLevel: v }))}>
                <SelectTrigger className="bg-ops-black border-ops-border text-ops-text font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ops-dark border-ops-border font-mono">
                  {THREAT_LEVELS.map(t => <SelectItem key={t} value={t} className="text-ops-text text-xs">{t}</SelectItem>)}
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
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">LAST KNOWN LOCATION</Label>
              <Input value={form.lastKnownLocation} onChange={e => setForm(f => ({ ...f, lastKnownLocation: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-text font-mono text-xs" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">CHARGES</Label>
              <Textarea value={form.charges} onChange={e => setForm(f => ({ ...f, charges: e.target.value }))}
                rows={3} className="bg-ops-black border-ops-border text-ops-text font-mono text-xs resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}
              className="font-mono text-xs text-ops-text-dim border border-ops-border hover:bg-ops-card">
              CANCEL
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}
              className="bg-ops-red/20 border border-ops-red text-ops-red hover:bg-ops-red/30 font-mono text-xs tracking-widest">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              {editingPerson ? 'UPDATE' : 'ADD TARGET'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
