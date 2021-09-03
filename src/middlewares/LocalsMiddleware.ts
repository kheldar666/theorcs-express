import { IMiddleware, Locals, Middleware, Req } from "@tsed/common";

@Middleware()
export class LocalsMiddleware implements IMiddleware {
  use(@Locals() locals: any, @Req() req: Req): void {
    if (req.isAuthenticated()) {
      locals.isAuthenticated = true;
      locals.currentUser = req.user;
    } else {
      locals.isAuthenticated = false;
      locals.currentUser = null;
    }
    locals.csrfToken = req.csrfToken();
  }
}
