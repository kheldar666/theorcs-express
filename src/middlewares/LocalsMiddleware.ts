import { IMiddleware, Locals, Middleware, Req } from "@tsed/common";

@Middleware()
export class LocalsMiddleware implements IMiddleware {
  use(@Locals() locals: any, @Req() req: Req): void {
    console.log("req.isAuthenticated()", req.isAuthenticated());
    if (req.isAuthenticated()) {
      locals.isAuthenticated = true;
      locals.currentUser = req.user;
    } else {
      locals.isAuthenticated = false;
      locals.currentUser = undefined;
    }
    locals.csrfToken = req.csrfToken();
  }
}
