import { Role } from "../auth/Role";

export interface Credentials {
  password: string;
  email: string;
  roles: Role[];
}
