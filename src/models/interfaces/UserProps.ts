import { UserInfo } from "@tsed/passport";
import { Credentials } from "./Credentials";
import { Identity } from "./Identity";

export interface UserProps extends UserInfo, Credentials, Identity {}
