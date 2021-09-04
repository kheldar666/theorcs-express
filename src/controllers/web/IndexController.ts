import {
  Controller,
  Get,
  Redirect,
  Req,
  Session,
  Use,
  View,
} from "@tsed/common";
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";
import { Inject } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { LocalsMiddleware } from "../../middlewares/LocalsMiddleware";
import { baseLocale } from "../../i18n/i18n-util";
import { i18nMiddleware } from "../../middlewares/i18nMiddleware";

@Controller("/")
@Use(LocalsMiddleware)
@Use(i18nMiddleware) // Must be set here so that it executes before LocalsMiddleware
export class IndexController {
  @Inject(User)
  private User: MongooseModel<User>;

  constructor(private userService: UserService) {}

  @Get("/:locale/")
  @View("index.ejs")
  get(@Req() req: Req) {}

  @Get("/:locale/set")
  @Redirect(302, "/")
  async set(@Session() session: any, @Req() req: Req) {
    await req.flash("error", "Test Error Flash Message");
    await req.flash("info", "Test Info Flash Message");
  }

  @Get("/")
  @Redirect(301, `/${baseLocale}/`)
  root() {}
}
