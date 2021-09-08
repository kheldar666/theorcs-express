import { EndpointInfo, Locals, Middleware, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { User } from "../models/User";

@Middleware()
export class AcceptRolesMiddleware {
  use(
    @Req() request: Req,
    @Locals() locals: any,
    @EndpointInfo() endpoint: EndpointInfo
  ) {
    if (request.user && request.isAuthenticated()) {
      const roles = endpoint.get(AcceptRolesMiddleware);

      if (!roles.includes((locals.currentUser as User).roles)) {
        throw new Unauthorized("Insufficient role");
      }
    }
  }
}
