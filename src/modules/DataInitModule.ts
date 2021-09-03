import { Inject, Module } from "@tsed/di";
import { UserService } from "../services/UserService";

@Module()
class DataInitModule {
  @Inject()
  userService: UserService;

  async $onInit() {
    try {
      await this.userService.initData();
    } catch (err) {
      throw err;
    }
  }
}
