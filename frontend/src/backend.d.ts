import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Mission {
    id: bigint;
    status: string;
    title: string;
    classificationLevel: string;
    date: string;
    description: string;
    department: string;
    assignedAgents: Array<bigint>;
}
export interface Asset {
    id: bigint;
    status: string;
    clearanceLevel: bigint;
    name: string;
    description: string;
    assetType: string;
    department: string;
}
export interface Weapon {
    id: bigint;
    status: string;
    clearanceLevel: bigint;
    name: string;
    description: string;
    weaponType: string;
    department: string;
}
export interface Agent {
    id: bigint;
    bio: string;
    status: AgentStatus;
    clearanceLevel: bigint;
    name: string;
    rank: string;
    codename: string;
    officerTitle: string;
    department: string;
}
export interface MostWanted {
    id: bigint;
    status: string;
    alias: string;
    threatLevel: string;
    lastKnownLocation: string;
    name: string;
    charges: string;
}
export interface UserProfile {
    name: string;
    role: string;
    department: string;
}
export enum AgentStatus {
    Inactive = "Inactive",
    Active = "Active",
    Banned = "Banned",
    Kicked = "Kicked",
    Redacted = "Redacted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banAgent(id: bigint): Promise<void>;
    createAgent(name: string, codename: string, department: string, rank: string, officerTitle: string, status: AgentStatus, bio: string, clearanceLevel: bigint): Promise<bigint>;
    createAsset(name: string, assetType: string, department: string, status: string, description: string, clearanceLevel: bigint): Promise<bigint>;
    createMission(title: string, department: string, classificationLevel: string, status: string, description: string, assignedAgents: Array<bigint>, date: string): Promise<bigint>;
    createMostWanted(name: string, alias: string, threatLevel: string, lastKnownLocation: string, charges: string, status: string): Promise<bigint>;
    createWeapon(name: string, weaponType: string, department: string, status: string, clearanceLevel: bigint, description: string): Promise<bigint>;
    deleteAsset(id: bigint): Promise<void>;
    deleteMission(id: bigint): Promise<void>;
    deleteMostWanted(id: bigint): Promise<void>;
    deleteWeapon(id: bigint): Promise<void>;
    getAgent(id: bigint): Promise<Agent>;
    getAllAgents(): Promise<Array<Agent>>;
    getAllAssets(): Promise<Array<Asset>>;
    getAllMissions(): Promise<Array<Mission>>;
    getAllMostWanted(): Promise<Array<MostWanted>>;
    getAsset(id: bigint): Promise<Asset>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMission(id: bigint): Promise<Mission>;
    getMostWanted(id: bigint): Promise<MostWanted>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeapons(): Promise<Array<Weapon>>;
    isCallerAdmin(): Promise<boolean>;
    removeAgent(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAgent(id: bigint, name: string, codename: string, department: string, rank: string, officerTitle: string, status: AgentStatus, bio: string, clearanceLevel: bigint): Promise<void>;
    updateAsset(id: bigint, name: string, assetType: string, department: string, status: string, description: string, clearanceLevel: bigint): Promise<void>;
    updateMission(id: bigint, title: string, department: string, classificationLevel: string, status: string, description: string, assignedAgents: Array<bigint>, date: string): Promise<void>;
    updateMostWanted(id: bigint, name: string, alias: string, threatLevel: string, lastKnownLocation: string, charges: string, status: string): Promise<void>;
    updateWeapon(id: bigint, name: string, weaponType: string, department: string, status: string, clearanceLevel: bigint, description: string): Promise<void>;
}
