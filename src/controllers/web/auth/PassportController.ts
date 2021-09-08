import {
  BodyParams,
  Context,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  Use,
} from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { UserDetails } from "../../../models/UserDetails";
import { LoginData } from "../../../models/forms/LoginData";
import { LocalsMiddleware } from "../../../middlewares/LocalsMiddleware";
import { i18nMiddleware } from "../../../middlewares/i18nMiddleware";

@Controller("/:locale/auth")
@Use(LocalsMiddleware)
@Use(i18nMiddleware) // Must be set here so that it executes before LocalsMiddleware
export class PassportController {
  @Post("/login")
  @Authenticate("login")
  @Redirect(302, "back")
  async login(
    @Req() req: Req,
    @BodyParams() loginData: LoginData,
    @Context() ctx: Context
  ) {
    const i18n = ctx.get("i18n");

    await req.flash("info", i18n.INFO_LOGIN_SUCCESSFUL());
  }

  @Post("/signup")
  @Authenticate("signup")
  signup(@Req() req: Req, @BodyParams() user: UserDetails) {
    // FACADE
    return req.user;
  }

  @Get("/logout")
  @Redirect(302, "../")
  logout(@Req() req: Req, @Res() res: Res) {
    req.logout();
  }
}
