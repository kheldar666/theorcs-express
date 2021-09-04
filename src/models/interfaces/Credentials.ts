import { Identity } from "./Identity";

export interface Credentials extends Identity {
  id: string;
  password: string;
  email: string;
}
