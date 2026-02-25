import { useState } from 'react';
import { useGetAllAgents, useCreateAgent, useUpdateAgent, useBanAgent, useRemoveAgent, useRedactAgent } from '../../hooks/useQueries';
import type { BackendAgent } from '../../hooks/useQueries';
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
import { Loader2, Plus, Edit, Ban, Trash2, EyeOff } from 'lucide-react';

const DEPARTMENTS = ['G.O.S.', 'S.I.N.', 'T.A.C.', 'V.O.I.D.', 'L.O.S.S.'];
const RANKS = ['Provisional Asset', 'Field Associate', 'Senior Operative', 'Principal Agent', 'Ghost Lead'];
const OFFICER_TITLES = ['D.O.', 'C.S.', 'S.O.', 'T.O.', 'A.O.'];
const STATUSES = ['Active', 'Inactive', 'Banned', 'Kicked', 'Redacted'];

interface AgentFormData {
  name: string;
  codename: string;
  department: string;
  rank: string;
  officerTitle: string;
  status: string;
  bio: string;
  clearanceLevel: string;
}

const emptyForm: AgentFormData = {
  name: '', codename: '', department: 'G.O.S.', rank: 'Field Associate',
  officerTitle: 'A.O.', status: 'Active', bio: '', clearanceLevel: '1',
};

function statusColor(status: string): string {
  switch (status) {
    case 'Banned': return 'text-ops-red';
    case 'Kicked': return 'text-ops-amber';
    case 'Redacted': return 'text-ops-red/70';
    default: return 'text-ops-green';
  }
}

export default function AgentManager() {
  const { data: agentsData, isLoading } = useGetAllAgents();
  const agents = agentsData as BackendAgent[] | undefined;

  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const banAgent = useBanAgent();
  const redactAgent = useRedactAgent();
  const removeAgent = useRemoveAgent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<BackendAgent | null>(null);
  const [form, setForm] = useState<AgentFormData>(emptyForm);

  const openCreate = () => {
    setEditingAgent(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (agent: BackendAgent) => {
    setEditingAgent(agent);
    setForm({
      name: agent.name,
      codename: agent.codename,
      department: agent.department,
      rank: agent.rank,
      officerTitle: agent.officerTitle,
      status: agent.status as string,
      bio: agent.bio,
      clearanceLevel: agent.clearanceLevel.toString(),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const data = {
      name: form.name,
      codename: form.codename,
      department: form.department,
      rank: form.rank,
      officerTitle: form.officerTitle,
      status: form.status,
      bio: form.bio,
      clearanceLevel: BigInt(parseInt(form.clearanceLevel) || 1),
    };
    if (editingAgent) {
      await updateAgent.mutateAsync({ id: editingAgent.id, ...data });
    } else {
      await createAgent.mutateAsync(data);
    }
    setDialogOpen(false);
  };

  const isPending = createAgent.isPending || updateAgent.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-lg font-bold text-ops-green tracking-widest">AGENT MANAGEMENT</h2>
        <Button onClick={openCreate} className="bg-ops-green/20 border border-ops-green text-ops-green hover:bg-ops-green/30 font-mono text-xs tracking-widest">
          <Plus className="h-3 w-3 mr-1" /> NEW AGENT
        </Button>
      </div>

      {isLoading && <div className="font-mono text-xs text-ops-text-dim tracking-widest">LOADING PERSONNEL DATA...</div>}

      {!isLoading && agents && (
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-ops-green-dim text-ops-text-dim tracking-widest">
                <th className="text-left py-2 pr-4">CODENAME</th>
                <th className="text-left py-2 pr-4">NAME</th>
                <th className="text-left py-2 pr-4">DEPT</th>
                <th className="text-left py-2 pr-4">RANK</th>
                <th className="text-left py-2 pr-4">TITLE</th>
                <th className="text-left py-2 pr-4">STATUS</th>
                <th className="text-left py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id.toString()} className="border-b border-ops-border hover:bg-ops-dark/50">
                  <td className="py-2 pr-4 text-ops-green font-bold">{agent.codename}</td>
                  <td className="py-2 pr-4 text-ops-text">{agent.name}</td>
                  <td className="py-2 pr-4 text-ops-amber">{agent.department}</td>
                  <td className="py-2 pr-4 text-ops-text-dim">{agent.rank}</td>
                  <td className="py-2 pr-4 text-ops-green">{agent.officerTitle}</td>
                  <td className="py-2 pr-4">
                    <span className={statusColor(agent.status as string)}>
                      {agent.status as string}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(agent)}
                        className="h-6 px-2 text-ops-green hover:bg-ops-green/10 font-mono text-[10px]">
                        <Edit className="h-3 w-3" />
                      </Button>

                      {/* Redact action */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost"
                            className="h-6 px-2 text-ops-red/70 hover:bg-ops-red/10 font-mono text-[10px]"
                            disabled={(agent.status as string) === 'Redacted'}>
                            <EyeOff className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-ops-dark border-ops-red font-mono">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-orbitron text-ops-red">REDACT AGENT</AlertDialogTitle>
                            <AlertDialogDescription className="text-ops-text-dim">
                              Redact agent <span className="text-ops-green">{agent.codename}</span>? Their dossier will be censored on the public roster.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-ops-card border-ops-border text-ops-text-dim">CANCEL</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => redactAgent.mutate(agent)}
                              className="bg-ops-red/20 border border-ops-red text-ops-red hover:bg-ops-red/30">
                              CONFIRM REDACT
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Ban action */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost"
                            className="h-6 px-2 text-ops-amber hover:bg-ops-amber/10 font-mono text-[10px]"
                            disabled={(agent.status as string) === 'Banned'}>
                            <Ban className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-ops-dark border-ops-red font-mono">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-orbitron text-ops-red">BAN AGENT</AlertDialogTitle>
                            <AlertDialogDescription className="text-ops-text-dim">
                              Ban agent <span className="text-ops-green">{agent.codename}</span>? They will be removed from public view.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-ops-card border-ops-border text-ops-text-dim">CANCEL</AlertDialogCancel>
                            <AlertDialogAction onClick={() => banAgent.mutate(agent.id)}
                              className="bg-ops-amber/20 border border-ops-amber text-ops-amber hover:bg-ops-amber/30">
                              CONFIRM BAN
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Remove action */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost"
                            className="h-6 px-2 text-ops-red hover:bg-ops-red/10 font-mono text-[10px]">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-ops-dark border-ops-red font-mono">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-orbitron text-ops-red">REMOVE AGENT</AlertDialogTitle>
                            <AlertDialogDescription className="text-ops-text-dim">
                              Permanently remove agent <span className="text-ops-green">{agent.codename}</span>? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-ops-card border-ops-border text-ops-text-dim">CANCEL</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeAgent.mutate(agent.id)}
                              className="bg-ops-red/20 border border-ops-red text-ops-red hover:bg-ops-red/30">
                              CONFIRM REMOVE
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-ops-text-dim tracking-widest">NO AGENTS ON RECORD</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-ops-dark border-ops-green-dim max-w-lg font-mono">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-ops-green tracking-widest">
              {editingAgent ? 'EDIT AGENT' : 'CREATE AGENT'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">NAME</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-text font-mono text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">CODENAME</Label>
              <Input value={form.codename} onChange={e => setForm(f => ({ ...f, codename: e.target.value }))}
                className="bg-ops-black border-ops-border text-ops-green font-mono text-xs" />
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
              <Label className="text-[10px] text-ops-text-dim tracking-widest">RANK</Label>
              <Select value={form.rank} onValueChange={v => setForm(f => ({ ...f, rank: v }))}>
                <SelectTrigger className="bg-ops-black border-ops-border text-ops-text font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ops-dark border-ops-border font-mono">
                  {RANKS.map(r => <SelectItem key={r} value={r} className="text-ops-text text-xs">{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-ops-text-dim tracking-widest">OFFICER TITLE</Label>
              <Select value={form.officerTitle} onValueChange={v => setForm(f => ({ ...f, officerTitle: v }))}>
                <SelectTrigger className="bg-ops-black border-ops-border text-ops-text font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ops-dark border-ops-border font-mono">
                  {OFFICER_TITLES.map(t => <SelectItem key={t} value={t} className="text-ops-text text-xs">{t}</SelectItem>)}
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
              <Label className="text-[10px] text-ops-text-dim tracking-widest">BIO / DOSSIER</Label>
              <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
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
              {editingAgent ? 'UPDATE' : 'CREATE'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
