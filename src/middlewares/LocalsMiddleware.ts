import { $log, IMiddleware, Locals, Middleware, Req } from "@tsed/common";
import { LogLevel } from "../config/logger/LogLevel";

@Middleware()
export class LocalsMiddleware implements IMiddleware {
  use(@Locals() locals: any, @Req() req: Req): void {
    if ($log.isLevelEnabled(LogLevel.DEBUG)) {
      $log.debug({
        Context: "LocalsMiddleware.use",
        isAuthenticated: req.isAuthenticated(),
      });
    }
    if (req.isAuthenticated()) {
      locals.isAuthenticated = true;
      locals.currentUser = req.user;
      if ($log.isLevelEnabled(LogLevel.DEBUG)) {
        $log.debug({ Context: "LocalsMiddleware.use", currentUser: req.user });
      }
    } else {
      locals.isAuthenticated = false;
      locals.currentUser = undefined;
    }
    locals.csrfToken = req.csrfToken();
  }
}
