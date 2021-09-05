import { EndpointInfo, Middleware, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { UserInfoWithRoles } from "../models/auth/UserInfoWithRoles";

@Middleware()
export class AcceptRolesMiddleware {
  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    if (request.user && request.isAuthenticated()) {
      const roles = endpoint.get(AcceptRolesMiddleware);

      if (!roles.includes((request.user as UserInfoWithRoles).roles)) {
        throw new Unauthorized("Insufficient role");
      }
    }
  }
}
