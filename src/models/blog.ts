import { User } from "./user";

export interface Blog {
  id: string; // or number depending on backend
  title: string;
  details: string;
  ownerId: string;
  coOwners?: User[]; // optional
  createdAt?: string;
}

export interface BlogPayload {
  title: string;
  details: string;
  coOwnerIds: string[];
}
