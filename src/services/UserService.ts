import { Inject, Intercept, Service } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "../models/User";
import { $log } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { UserProps } from "../models/interfaces/UserProps";
import { EncryptPasswordInterceptor } from "../interceptors/EncryptPasswordInterceptor";

const defaultUser: UserProps = {
  id: "",
  firstName: "Admin",
  lastName: "Admin",
  email: "admin@localhost",
  password: "password",
};

@Service()
export class UserService {
  @Inject(User)
  private User: MongooseModel<User>;

  async find(id: string): Promise<User> {
    $log.debug({ Context: "UserService.find", id: id });

    const user = await this.User.findById(id);
    if (user) {
      $log.debug({
        Context: "UserService.find",
        message: "User found",
        user: user,
      });
      return user;
    }
    throw new NotFound("User not found");
  }

  @Intercept(EncryptPasswordInterceptor)
  async save(user: User): Promise<User> {
    $log.debug({ Context: "UserService.save", user: user });

    //TODO: Validate the user input
    const model = new this.User(user);
    $log.debug({ Context: "UserService.save", message: "Saving user" });
    await model.updateOne(user, { upsert: true });

    $log.debug({ Context: "UserService.save", message: "User saved" });

    return model;
  }

  async findOne(predicate: Partial<User>): Promise<User> {
    $log.debug({ Context: "UserService.findOne", predicate: predicate });
    const aUser = await this.User.findOne(predicate);
    if (aUser) {
      $log.debug({ Context: "UserService.findOne", result: aUser });
      return aUser;
    }
    throw new NotFound("User not found");
  }

  async initData(): Promise<void> {
    $log.debug("Initializing User Data");
    try {
      await this.findOne({});
      $log.debug("Found existing data. Initialization not required");
    } catch (err) {
      $log.debug("No User data found. Creating a default user");
      try {
        const defUser = await this.save(new this.User(defaultUser));
        $log.debug("Created Default User", defUser);
      } catch (err) {
        throw err;
      }
    }
  }
}
