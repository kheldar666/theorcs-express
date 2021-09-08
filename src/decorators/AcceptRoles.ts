import { UseBeforeEach } from "@tsed/common";
import { StoreSet, useDecorators } from "@tsed/core";
import { AcceptRolesMiddleware } from "../middlewares/AccepRolesMiddleware";
import { Role } from "../models/auth/Role";

export function AcceptRoles(...roles: Role[]) {
  return useDecorators(
    UseBeforeEach(AcceptRolesMiddleware),
    StoreSet(AcceptRolesMiddleware, roles)
  );
}
