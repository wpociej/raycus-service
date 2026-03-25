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
  manualUrls: string[];
  errorCodes: ErrorCode[];
  status: "in_production" | "discontinued";
  createdAt: Date;
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
