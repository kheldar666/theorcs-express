import {
  BodyParams,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
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
import { LoginData } from "../../models/forms/LoginData";

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

  @Post("/:locale/test-validation")
  @View("index.ejs")
  testValidation(@Req() req: Req, @BodyParams() loginData: LoginData) {}

  @Get("/")
  @Redirect(301, `/${baseLocale}/`)
  root() {}
}
