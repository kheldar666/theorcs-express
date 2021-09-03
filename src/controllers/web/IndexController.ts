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

@Controller("/")
@Use(LocalsMiddleware)
export class IndexController {
  @Inject(User)
  private User: MongooseModel<User>;

  constructor(private userService: UserService) {}

  @Get("/")
  @View("index.ejs")
  get(@Req() req: Req) {
    return {
      reqIsAuthenticated: req.isAuthenticated(),
      reqUser: req.user,
    };
  }

  @Get("/set")
  @Redirect(302, "/")
  async set(@Session() session: any, @Req() req: Req) {
    await req.flash("error", "Test Error Flash Message");
    await req.flash("info", "Test Info Flash Message");
  }
}
