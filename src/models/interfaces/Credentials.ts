import { Identity } from "./Identity";
import { Role } from "../auth/Role";

export interface Credentials extends Identity {
  id: string;
  password: string;
  email: string;
  roles: Role[];
}
