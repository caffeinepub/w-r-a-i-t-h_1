import { useState } from 'react';
import { useGetAllMissions, useCreateMission, useUpdateMission, useDeleteMission } from '../../hooks/useQueries';
import type { BackendMission } from '../../hooks/useQueries';
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
const CLASSIFICATIONS = ['UNCLASSIFIED', 'CONFIDENTIAL', 'SECRET', 'TOP SECRET'];
const STATUSES = ['Active', 'Completed', 'Redacted'];

interface MissionFormData {
  title: string;
  department: string;
  classificationLevel: string;
  status: string;
  description: string;
  assignedAgents: string;
  date: string;
}

const emptyForm: MissionFormData = {
  title: '', department: 'G.O.S.', classificationLevel: 'CONFIDENTIAL',
  status: 'Active', description: '', assignedAgents: '', date: new Date().toISOString().split('T')[0],
};

export default function MissionManager() {
  const { data: missionsData, isLoading } = useGetAllMissions();
  const missions = missionsData as BackendMission[] | undefined;

  const createMission = useCreateMission();
  const updateMission = useUpdateMission();
  const deleteMission = useDeleteMission();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<BackendMission | null>(null);
  const [form, setForm] = useState<MissionFormData>(emptyForm);

  const openCreate = () => {
    setEditingMission(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (mission: BackendMission) => {
    setEditingMission(mission);
    setForm({
      title: mission.title,
      department: mission.department,
      classificationLevel: mission.classificationLevel,
      status: mission.status,
      description: mission.description,
      assignedAgents: mission.assignedAgents.map(id => id.toString()).join(', '),
      date: mission.date,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const agentIds = form.assignedAgents
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => BigInt(parseInt(s)));

    const data = {
      title: form.title,
      department: form.department,
      classificationLevel: form.classificationLevel,
      status: form.status,
      description: form.description,
      assignedAgents: agentIds,
      date: form.date,
    };

    if (editingMission) {
      await updateMission.mutateAsync({ id: editingMission.id, ...data });
    } else {
      await createMission.mutateAsync(data);
    }
    setDialogOpen(false);
  };

  const isPending = createMission.isPending || updateMission.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-lg font-bold text-ops-green tracking-widest">MISSION MANAGEMENT</h2>
        <Button onClick={openCreate} className="bg-ops-green/20 border border-ops-green text-ops-green hover:bg-ops-green/30 font-mono text-xs tracking-widest">
          <Plus className="h-3 w-3 mr-1" /> NEW MISSION
        </Button>
      </div>

      {isLoading && <div className="font-mono text-xs text-ops-text-dim tracking-widest">LOADING MISSION DATA...</div>}

      {!isLoading && missions && (
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-ops-green-dim text-ops-text-dim tracking-widest">
                <th className="text-left py-2 pr-4">TITLE</th>
                <th className="text-left py-2 pr-4">DEPT</th>
                <th className="text-left py-2 pr-4">CLASSIFICATION</th>
                <th className="text-left py-2 pr-4">STATUS</th>
                <th className="text-left py-2 pr-4">DATE</th>
                <th className="text-left py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((mission) => (
                <tr key={mission.id.toString()} className="border-b border-ops-border hover:bg-ops-dark/50">
                  <td className="py-2 pr-4 text-ops-text">{mission.title}</td>
                  <td className="py-2 pr-4 text-ops-amber">{mission.department}</td>
                  <td className="py-2 pr-4 text-ops-text-dim">{mission.classificationLevel}</td>
                  <td className="py-2 pr-4">
                    <span className={mission.status === 'Active' ? 'text-ops-green' : mission.status === 'Redacted' ? 'text-ops-red' : 'text-ops-amber'}>
                      {mission.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-ops-text-dim">{mission.date}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(mission)}
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
                            <AlertDialogTitle className="font-orbitron text-ops-red">DELETE MISSION</AlertDialogTitle>
                            <AlertDialogDescription className="text-ops-text-dim">
                              Permanently delete mission <span className="text-ops-green">"{mission.title}"</span>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-ops-card border-ops-border text-ops-text-dim">CANCEL</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMission.mutate(mission.id)}
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
              {missions.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-ops-text-dim tracking-widest">NO MISSIONS ON RECORD</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-ops-dark border-ops-green-dim max-w-lg font-mono">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-ops-green tracking-widest">
              {editingMission ? 'EDIT MISSION' : 'CREATE MISSION'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">MISSION TITLE</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-text font-mono text-xs" />
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
              <Label className="text-[10px] text-ops-text-dim tracking-widest">CLASSIFICATION</Label>
              <Select value={form.classificationLevel} onValueChange={v => setForm(f => ({ ...f, classificationLevel: v }))}>
                <SelectTrigger className="bg-ops-black border-ops-border text-ops-text font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ops-dark border-ops-border font-mono">
                  {CLASSIFICATIONS.map(c => <SelectItem key={c} value={c} className="text-ops-text text-xs">{c}</SelectItem>)}
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
              <Label className="text-[10px] text-ops-text-dim tracking-widest">DATE</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-text font-mono text-xs" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">ASSIGNED AGENT IDs (comma-separated)</Label>
              <Input value={form.assignedAgents} onChange={e => setForm(f => ({ ...f, assignedAgents: e.target.value }))}
                placeholder="e.g. 1, 2, 3"
                className="bg-ops-black border-ops-border text-ops-text font-mono text-xs" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">DESCRIPTION / BRIEFING</Label>
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
              {editingMission ? 'UPDATE' : 'CREATE'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
