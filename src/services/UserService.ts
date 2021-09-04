import { Inject, Intercept, Service } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "../models/User";
import { $log } from "@tsed/common";
import { UserProps } from "../models/interfaces/UserProps";
import { AbstractService } from "./base/AbstractService";
import { EncryptPasswordInterceptor } from "../interceptors/EncryptPasswordInterceptor";

@Service()
export class UserService extends AbstractService<User, MongooseModel<User>> {
  @Inject(User)
  private User: MongooseModel<User>;

  @Intercept(EncryptPasswordInterceptor)
  async save(user: User): Promise<User> {
    return super.save(user);
  }

  async initData(): Promise<void> {
    $log.debug("Initializing User Data");
    try {
      await this.findOne({});
      $log.debug("Found existing data. Initialization not required");
    } catch (err) {
      $log.debug("No User data found. Creating a default user");
      try {
        const defUser = await this.save(new this.model(defaultUser));
        $log.debug("Created Default User", defUser);
      } catch (err) {
        throw err;
      }
    }
  }

  get model(): MongooseModel<User> {
    return this.User;
  }
}

const defaultUser: UserProps = {
  id: "",
  details: {
    firstName: "Admin",
    lastName: "Admin",
  },
  email: "admin@localhost",
  password: "password",
};
