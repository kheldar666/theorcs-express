import { BodyParams, Controller, Get, Post, Redirect, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Credentials } from "../../../models/interfaces/Credentials";
import { UserDetails } from "../../../models/UserDetails";

@Controller("/auth")
export class PassportController {
  @Post("/login")
  @Authenticate("login")
  @Redirect(302, "/")
  async login(@Req() req: Req, @BodyParams() credentials: Credentials) {
    if (!req.isAuthenticated()) {
      await req.flash("error", "Invalid Credentials");
    } else {
      await req.flash("info", "Login successful");
    }
  }

  @Post("/signup")
  @Authenticate("signup")
  signup(@Req() req: Req, @BodyParams() user: UserDetails) {
    // FACADE
    return req.user;
  }

  @Get("/logout")
  @Redirect(302, "/")
  logout(@Req() req: Req) {
    req.logout();
  }
}
