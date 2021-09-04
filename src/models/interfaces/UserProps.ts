import { Credentials } from "./Credentials";
import { UserDetailsProps } from "./UserDetailsProps";

export interface UserProps extends Credentials {
  details?: UserDetailsProps;
}
