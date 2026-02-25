import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Agent as BackendAgent,
  Mission as BackendMission,
  Asset as BackendAsset,
  MostWanted as BackendMostWanted,
  Weapon as BackendWeapon,
} from '../backend';
import { AgentStatus } from '../backend';

// Re-export aliased types for use in components
export type { BackendAgent, BackendMission, BackendAsset, BackendMostWanted, BackendWeapon };

// ─── Agents ───────────────────────────────────────────────────────────────────

export function useGetAllAgents() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendAgent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      if (!actor) return [] as BackendAgent[];
      const result = await actor.getAllAgents();
      return result as unknown as BackendAgent[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAgentsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendAgent[]>({
    queryKey: ['agents-admin'],
    queryFn: async () => {
      if (!actor) return [] as BackendAgent[];
      const result = await actor.getAllAgents();
      return result as unknown as BackendAgent[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAgent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string; codename: string; department: string; rank: string;
      officerTitle: string; status: string; bio: string; clearanceLevel: bigint;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.createAgent(data.name, data.codename, data.department, data.rank, data.officerTitle, data.status as AgentStatus, data.bio, data.clearanceLevel);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agents'] });
      qc.invalidateQueries({ queryKey: ['agents-admin'] });
    },
  });
}

export function useUpdateAgent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint; name: string; codename: string; department: string; rank: string;
      officerTitle: string; status: string; bio: string; clearanceLevel: bigint;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateAgent(data.id, data.name, data.codename, data.department, data.rank, data.officerTitle, data.status as AgentStatus, data.bio, data.clearanceLevel);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agents'] });
      qc.invalidateQueries({ queryKey: ['agents-admin'] });
    },
  });
}

export function useBanAgent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.banAgent(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agents'] });
      qc.invalidateQueries({ queryKey: ['agents-admin'] });
    },
  });
}

export function useRedactAgent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (agent: BackendAgent) => {
      if (!actor) throw new Error('No actor');
      return actor.updateAgent(
        agent.id,
        agent.name,
        agent.codename,
        agent.department,
        agent.rank,
        agent.officerTitle,
        AgentStatus.Redacted,
        agent.bio,
        agent.clearanceLevel,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agents'] });
      qc.invalidateQueries({ queryKey: ['agents-admin'] });
    },
  });
}

export function useRemoveAgent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.removeAgent(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agents'] });
      qc.invalidateQueries({ queryKey: ['agents-admin'] });
    },
  });
}

// ─── Missions ─────────────────────────────────────────────────────────────────

export function useGetAllMissions() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendMission[]>({
    queryKey: ['missions'],
    queryFn: async () => {
      if (!actor) return [] as BackendMission[];
      const result = await actor.getAllMissions();
      return result as unknown as BackendMission[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMission() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string; department: string; classificationLevel: string;
      status: string; description: string; assignedAgents: bigint[]; date: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.createMission(data.title, data.department, data.classificationLevel, data.status, data.description, data.assignedAgents, data.date);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['missions'] }),
  });
}

export function useUpdateMission() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint; title: string; department: string; classificationLevel: string;
      status: string; description: string; assignedAgents: bigint[]; date: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateMission(data.id, data.title, data.department, data.classificationLevel, data.status, data.description, data.assignedAgents, data.date);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['missions'] }),
  });
}

export function useDeleteMission() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteMission(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['missions'] }),
  });
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export function useGetAllAssets() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendAsset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      if (!actor) return [] as BackendAsset[];
      const result = await actor.getAllAssets();
      return result as unknown as BackendAsset[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAsset() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string; assetType: string; department: string;
      status: string; description: string; clearanceLevel: bigint;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.createAsset(data.name, data.assetType, data.department, data.status, data.description, data.clearanceLevel);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  });
}

export function useUpdateAsset() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint; name: string; assetType: string; department: string;
      status: string; description: string; clearanceLevel: bigint;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateAsset(data.id, data.name, data.assetType, data.department, data.status, data.description, data.clearanceLevel);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  });
}

export function useDeleteAsset() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteAsset(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  });
}

// ─── Most Wanted ──────────────────────────────────────────────────────────────

export function useGetAllMostWanted() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendMostWanted[]>({
    queryKey: ['most-wanted'],
    queryFn: async () => {
      if (!actor) return [] as BackendMostWanted[];
      const result = await actor.getAllMostWanted();
      return result as unknown as BackendMostWanted[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMostWanted() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string; alias: string; threatLevel: string;
      lastKnownLocation: string; charges: string; status: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.createMostWanted(data.name, data.alias, data.threatLevel, data.lastKnownLocation, data.charges, data.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['most-wanted'] }),
  });
}

export function useUpdateMostWanted() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint; name: string; alias: string; threatLevel: string;
      lastKnownLocation: string; charges: string; status: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateMostWanted(data.id, data.name, data.alias, data.threatLevel, data.lastKnownLocation, data.charges, data.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['most-wanted'] }),
  });
}

export function useDeleteMostWanted() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteMostWanted(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['most-wanted'] }),
  });
}

// ─── Weapons ──────────────────────────────────────────────────────────────────

export function useGetWeapons() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendWeapon[]>({
    queryKey: ['weapons'],
    queryFn: async () => {
      if (!actor) return [] as BackendWeapon[];
      const result = await actor.getWeapons();
      return result as unknown as BackendWeapon[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateWeapon() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string; weaponType: string; department: string;
      status: string; clearanceLevel: bigint; description: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.createWeapon(data.name, data.weaponType, data.department, data.status, data.clearanceLevel, data.description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weapons'] }),
  });
}

export function useUpdateWeapon() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint; name: string; weaponType: string; department: string;
      status: string; clearanceLevel: bigint; description: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateWeapon(data.id, data.name, data.weaponType, data.department, data.status, data.clearanceLevel, data.description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weapons'] }),
  });
}

export function useDeleteWeapon() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteWeapon(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weapons'] }),
  });
}
