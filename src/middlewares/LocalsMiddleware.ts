import {
  $log,
  Context,
  IMiddleware,
  Locals,
  Middleware,
  Req,
} from "@tsed/common";
import { Inject } from "@tsed/di";
import { UserService } from "../services/UserService";
import { UserInfo } from "@tsed/passport";
import { isProduction } from "../config/env";

@Middleware()
export class LocalsMiddleware implements IMiddleware {
  @Inject()
  userService: UserService;

  async use(
    @Locals() locals: any,
    @Req() req: Req,
    @Context() ctx: Context
  ): Promise<void> {
    if (req.isAuthenticated()) {
      console.log("req.user", req.user);
      locals.isAuthenticated = true;
      const currentUser = await this.userService.findById(
        (req.user as UserInfo).id
      );
      locals.currentUser = currentUser;
      $log.debug({
        Context: "LocalsMiddleware.use",
        currentUser: currentUser,
      });
    } else {
      locals.isAuthenticated = false;
      locals.currentUser = undefined;
    }
    locals.csrfToken = req.csrfToken();
    locals.locale = ctx.get("locale");
    locals.i18n = ctx.get("i18n");
    locals.isProduction = isProduction;

    $log.debug({
      Context: "LocalsMiddleware.use",
      locals: locals,
    });
  }
}
