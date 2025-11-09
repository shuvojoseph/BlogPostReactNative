import { User } from "./user";

export interface Blog {
  id: string; // or number depending on backend
  title: string;
  details: string;
  owners?: User[];
  ownerId: string;
  coOwners?: User[]; // optional
  lastUpdateTime?: string;
}

export interface BlogPayload {
  title: string;
  details: string;
  coOwnerIds: string[];
}
