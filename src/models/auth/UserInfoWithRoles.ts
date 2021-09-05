import { UserInfo } from "@tsed/passport";
import { Role } from "./Role";

export declare class UserInfoWithRoles extends UserInfo {
  roles: Role[];
}
