import {
  $log,
  Context,
  IMiddleware,
  Locals,
  Middleware,
  Req,
} from "@tsed/common";
import { LogLevel } from "../config/logger/LogLevel";
import { Inject } from "@tsed/di";
import { UserService } from "../services/UserService";
import { UserInfo } from "@tsed/passport";

@Middleware()
export class LocalsMiddleware implements IMiddleware {
  @Inject()
  userService: UserService;

  async use(
    @Locals() locals: any,
    @Req() req: Req,
    @Context() ctx: Context
  ): Promise<void> {
    if ($log.isLevelEnabled(LogLevel.DEBUG)) {
      $log.debug({
        Context: "LocalsMiddleware.use",
        isAuthenticated: req.isAuthenticated(),
      });
    }
    if (req.isAuthenticated()) {
      locals.isAuthenticated = true;
      const currentUser = await this.userService.findById(
        (req.user as UserInfo).id
      );
      locals.currentUser = currentUser;
      if ($log.isLevelEnabled(LogLevel.DEBUG)) {
        $log.debug({
          Context: "LocalsMiddleware.use",
          currentUser: currentUser,
        });
      }
    } else {
      locals.isAuthenticated = false;
      locals.currentUser = undefined;
    }
    locals.csrfToken = req.csrfToken();
    locals.i18n = ctx.get("i18n");
  }
}
