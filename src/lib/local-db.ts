import fs from "fs";
import path from "path";
import { UserProfile, Machine, MachineModel } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function readJSON<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function tryWriteJSON<T>(filename: string, data: T[]): boolean {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch {
    // Read-only filesystem (Vercel) — use in-memory cache only
    return false;
  }
}

// In-memory caches (populated from JSON on first access, mutations stored here)
let usersCache: StoredUser[] | null = null;
let machinesCache: Machine[] | null = null;
let modelsCache: MachineModel[] | null = null;

// --- Users ---

interface StoredUser extends UserProfile {
  password: string;
}

export function getUsers(): StoredUser[] {
  if (!usersCache) usersCache = readJSON<StoredUser>("users.json");
  return usersCache;
}

export function getUserByEmail(email: string): StoredUser | undefined {
  return getUsers().find((u) => u.email === email);
}

export function getUserByUid(uid: string): StoredUser | undefined {
  return getUsers().find((u) => u.uid === uid);
}

export function createUser(user: StoredUser): StoredUser {
  const users = getUsers();
  users.push(user);
  usersCache = users;
  tryWriteJSON("users.json", users);
  return user;
}

export function getAllCustomers(): UserProfile[] {
  return getUsers()
    .filter((u) => u.role === "customer")
    .map(({ password: _, ...rest }) => rest);
}

// --- Machine Models ---

export function getMachineModels(): MachineModel[] {
  if (!modelsCache) modelsCache = readJSON<MachineModel>("machine-models.json");
  return modelsCache;
}

export function getMachineModelById(id: string): MachineModel | undefined {
  return getMachineModels().find((m) => m.id === id);
}

export function addMachineModel(
  model: Omit<MachineModel, "id" | "createdAt">
): MachineModel {
  const models = getMachineModels();
  const newModel: MachineModel = {
    ...model,
    id: `rfl-custom-${Date.now()}`,
    createdAt: new Date(),
  };
  models.push(newModel);
  modelsCache = models;
  tryWriteJSON("machine-models.json", models);
  return newModel;
}

// --- Machines ---

export function getMachines(): Machine[] {
  if (!machinesCache) machinesCache = readJSON<Machine>("machines.json");
  return machinesCache;
}

export function getMachinesByOwner(ownerId: string): Machine[] {
  return getMachines().filter((m) => m.ownerId === ownerId);
}

export function addMachine(
  data: Omit<Machine, "id" | "registeredAt" | "verifiedByAdmin">
): Machine {
  const machines = getMachines();
  const newMachine: Machine = {
    ...data,
    id: `mach-${Date.now()}`,
    verifiedByAdmin: false,
    registeredAt: new Date(),
  };
  machines.push(newMachine);
  machinesCache = machines;
  tryWriteJSON("machines.json", machines);
  return newMachine;
}

export function verifyMachineById(machineId: string): boolean {
  const machines = getMachines();
  const idx = machines.findIndex((m) => m.id === machineId);
  if (idx === -1) return false;
  machines[idx].verifiedByAdmin = true;
  machinesCache = machines;
  tryWriteJSON("machines.json", machines);
  return true;
}
