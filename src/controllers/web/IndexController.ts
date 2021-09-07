import {
  BodyParams,
  Controller,
  Get,
  Post,
  Req,
  Use,
  View,
} from "@tsed/common";
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";
import { Inject } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { LocalsMiddleware } from "../../middlewares/LocalsMiddleware";
import { i18nMiddleware } from "../../middlewares/i18nMiddleware";
import { TestData } from "../../models/forms/TestData";

@Controller("/:locale")
@Use(LocalsMiddleware)
@Use(i18nMiddleware) // Must be set here so that it executes before LocalsMiddleware
export class IndexController {
  @Inject(User)
  private User: MongooseModel<User>;

  constructor(private userService: UserService) {}

  @Get("/")
  @View("index.ejs")
  index() {}

  @Post("/test-validation")
  @View("index.ejs")
  testValidation(@Req() req: Req, @BodyParams() testData: TestData) {
    const delta = testData.deltaContent;
  }
}
