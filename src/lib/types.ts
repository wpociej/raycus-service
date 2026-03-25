export type UserRole = "admin" | "customer";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  company: string;
  phone: string;
  createdAt: Date;
}

export type MachineStatus = "active" | "maintenance" | "decommissioned";

export type LaserCategory =
  | "CW Fiber Laser"
  | "HP CW Fiber Laser"
  | "QCW Fiber Laser"
  | "Pulsed Fiber Laser"
  | "MOPA Fiber Laser"
  | "Q-Switched Fiber Laser"
  | "ABP Fiber Laser"
  | "3D Printing Fiber Laser"
  | "Direct Diode Laser";

export interface MachineModel {
  id: string;
  name: string;
  series: string;
  category: LaserCategory;
  powerWatt: number;
  wavelength: string;
  description: string;
  specs: Record<string, string>;
  manualUrls: ModelDocument[];
  errorCodes: ErrorCode[];
  warrantyYears?: number;
  status: "in_production" | "discontinued";
  createdAt: Date;
}

export interface ModelDocument {
  name: string;
  docType: string;
  url: string;
  language: "EN" | "CN";
}

export interface ErrorCode {
  code: string;
  description: string;
  solution: string;
  severity: "error" | "warning";
}

export interface Machine {
  id: string;
  serialNumber: string;
  modelId: string;
  modelName: string;
  ownerId: string;
  purchaseDate: Date;
  warrantyExpiry: Date;
  status: MachineStatus;
  verifiedByAdmin: boolean;
  registeredAt: Date;
}

// --- Support Tickets ---

export type TicketPriority = "critical" | "high" | "normal" | "low";
export type TicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";

export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  machineId: string;
  machineName: string;
  machineSerial: string;
  errorCode?: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  priority: TicketPriority;
  status: TicketStatus;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

// --- Knowledge Base ---

export interface KBArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  relatedModels: string[];
  createdAt: string;
}
