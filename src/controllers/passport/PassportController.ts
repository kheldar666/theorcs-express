import { BodyParams, Controller, Get, Post, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Credentials } from "../../models/interfaces/Credentials";
import { User } from "../../models/User";
import { Returns, Security } from "@tsed/schema";
import { UserDetails } from "../../models/UserDetails";

@Controller("/")
export class PassportCtrl {
  @Post("/login")
  @Authenticate("login", {
    failWithError: false,
    failureFlash: true,
    successRedirect: "/",
    failureRedirect: "/",
  })
  login(@Req() req: Req, @BodyParams() credentials: Credentials) {}

  @Post("/signup")
  @Authenticate("signup")
  signup(@Req() req: Req, @BodyParams() user: UserDetails) {
    // FACADE
    return req.user;
  }

  @Get("/userinfo")
  @Authenticate("basic")
  @Security("auth:basic")
  @Returns(200, User)
  getUserInfo(@Req() req: Req): any {
    // FACADE
    return req.user;
  }

  @Get("/logout")
  logout(@Req() req: Req) {
    req.logout();
  }

  @Get("/connect/:protocol")
  @Authorize(":protocol")
  @Returns(200, User)
  connectProtocol(@Req() req: Req): any {
    // FACADE
    return req.user;
  }

  @Get("/connect/:protocol/callback")
  @Authorize(":protocol")
  @Returns(200, User)
  connectProtocolCallback(@Req() req: Req): any {
    // FACADE
    return req.user;
  }
}
