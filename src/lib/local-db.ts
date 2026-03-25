import fs from "fs";
import path from "path";
import { UserProfile, Machine, MachineModel, Ticket, TicketMessage, KBArticle } from "./types";

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
    return false;
  }
}

let usersCache: StoredUser[] | null = null;
let machinesCache: Machine[] | null = null;
let modelsCache: MachineModel[] | null = null;
let ticketsCache: Ticket[] | null = null;
let kbCache: KBArticle[] | null = null;

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

export function getWarrantyYears(modelId: string): number {
  const model = getMachineModelById(modelId);
  return model?.warrantyYears ?? 2; // default 2 years
}

export function addMachineModel(model: Omit<MachineModel, "id" | "createdAt">): MachineModel {
  const models = getMachineModels();
  const newModel: MachineModel = { ...model, id: `rfl-custom-${Date.now()}`, createdAt: new Date() };
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

export function getMachineById(id: string): Machine | undefined {
  return getMachines().find((m) => m.id === id);
}

export function addMachine(data: Omit<Machine, "id" | "registeredAt" | "verifiedByAdmin" | "warrantyExpiry"> & { warrantyExpiry?: Date }): Machine {
  const machines = getMachines();
  const warrantyYrs = getWarrantyYears(data.modelId);
  const purchase = new Date(data.purchaseDate);
  const warrantyExpiry = data.warrantyExpiry || new Date(purchase.setFullYear(purchase.getFullYear() + warrantyYrs));

  const newMachine: Machine = {
    ...data,
    id: `mach-${Date.now()}`,
    warrantyExpiry,
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

// --- Tickets ---

export function getTickets(): Ticket[] {
  if (!ticketsCache) ticketsCache = readJSON<Ticket>("tickets.json");
  return ticketsCache;
}

export function getTicketById(id: string): Ticket | undefined {
  return getTickets().find((t) => t.id === id);
}

export function getTicketsByCustomer(customerId: string): Ticket[] {
  return getTickets().filter((t) => t.customerId === customerId);
}

export function createTicket(data: Omit<Ticket, "id" | "messages" | "createdAt" | "updatedAt">): Ticket {
  const tickets = getTickets();
  const now = new Date().toISOString();
  const ticket: Ticket = { ...data, id: `ticket-${Date.now()}`, messages: [], createdAt: now, updatedAt: now };
  tickets.push(ticket);
  ticketsCache = tickets;
  tryWriteJSON("tickets.json", tickets);
  return ticket;
}

export function addTicketMessage(ticketId: string, message: Omit<TicketMessage, "id" | "createdAt">): TicketMessage | null {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const msg: TicketMessage = { ...message, id: `msg-${Date.now()}`, createdAt: now };
  tickets[idx].messages.push(msg);
  tickets[idx].updatedAt = now;
  ticketsCache = tickets;
  tryWriteJSON("tickets.json", tickets);
  return msg;
}

export function updateTicketStatus(ticketId: string, status: Ticket["status"]): boolean {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return false;
  tickets[idx].status = status;
  tickets[idx].updatedAt = new Date().toISOString();
  ticketsCache = tickets;
  tryWriteJSON("tickets.json", tickets);
  return true;
}

// --- Knowledge Base ---

export function getKBArticles(): KBArticle[] {
  if (!kbCache) kbCache = readJSON<KBArticle>("kb-articles.json");
  return kbCache;
}

export function getKBArticleBySlug(slug: string): KBArticle | undefined {
  return getKBArticles().find((a) => a.slug === slug);
}

export function getKBArticleById(id: string): KBArticle | undefined {
  return getKBArticles().find((a) => a.id === id);
}

export function searchKBArticles(query: string): KBArticle[] {
  const q = query.toLowerCase();
  return getKBArticles().filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.content.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );
}
