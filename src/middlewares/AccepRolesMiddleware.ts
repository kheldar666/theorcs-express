import { EndpointInfo, Locals, Middleware, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { User } from "../models/User";
import { Role } from "../models/auth/Role";

@Middleware()
export class AcceptRolesMiddleware {
  use(
    @Req() request: Req,
    @Locals() locals: any,
    @EndpointInfo() endpoint: EndpointInfo
  ) {
    if (request.isAuthenticated()) {
      const acceptRoles: Role[] = endpoint.get(AcceptRolesMiddleware);
      const usersRoles: Role[] = (locals.currentUser as User).roles;
      const rolesInCommon = acceptRoles.filter((role) => {
        return usersRoles.indexOf(role);
      });

      if (!rolesInCommon.length) {
        throw new Unauthorized("Insufficient role");
      }
    } else {
      throw new Unauthorized("User Not Authenticated");
    }
  }
}
