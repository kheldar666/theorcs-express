import { $log, Controller, Get, Session, View } from "@tsed/common";
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";
import { Inject } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";

@Controller("/")
export class IndexController {
  @Inject(User)
  private User: MongooseModel<User>;

  constructor(private userService: UserService) {}
  @Get("/")
  @View("index.ejs")
  async get(@Session() session: any) {
    console.log(session);
    const newUser = new this.User({ name: "Martin Papy" });
    //const user = await this.userService.save(newUser);
    return {
      infoMessage:
        "<strong>Holy guacamole!</strong> You should check in on some of those fields below.",
      errorMessage: "undefined",
      user: newUser,
    };
  }
}
