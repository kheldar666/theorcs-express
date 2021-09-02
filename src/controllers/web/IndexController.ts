import {
  $log,
  Controller,
  Get,
  Locals,
  Req,
  Session,
  UseBefore,
  View,
} from "@tsed/common";
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";
import { Inject } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { FlashErrorMessage } from "../../middlewares/FlashErrorMessage";

@Controller("/")
@UseBefore(FlashErrorMessage)
export class IndexController {
  @Inject(User)
  private User: MongooseModel<User>;

  private counter: number = 0;

  constructor(private userService: UserService) {}
  @Get("/")
  @View("index.ejs")
  async get(@Session() session: any, @Req() req: Req) {
    const newUser = new this.User({ name: "Martin Papy" });
    let setFlash = false;
    //const user = await this.userService.save(newUser);
    if (this.counter % 2) {
      req.flash("error", "Test Error Flash Message");
      req.flash("info", "Test Info Flash Message");
      setFlash = true;
    }
    this.counter++;
    return {
      user: newUser,
      counter: this.counter,
      setFlash: setFlash,
    };
  }
}
