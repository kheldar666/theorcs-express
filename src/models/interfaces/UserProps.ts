import { Credentials } from "./Credentials";
import { Identity } from "./Identity";
import { UserDetailsProps } from "./UserDetailsProps";

export interface UserProps extends UserDetailsProps, Credentials, Identity {}
