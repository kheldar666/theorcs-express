import { Inject, Service } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "../models/User";
import { $log } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { UserProps } from "../models/interfaces/UserProps";

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
    $log.debug("Search a User from ID", id);

    const user = await this.User.findById(id);
    if (user) {
      $log.debug("Found User", user);
      return user;
    }
    throw new NotFound("User not found");
  }

  async save(user: User): Promise<User> {
    $log.debug({ message: "Validate user", user });

    //TODO: Validate the user input
    const model = new this.User(user);
    $log.debug({ message: "Save user", user });
    await model.updateOne(user, { upsert: true });

    $log.debug({ message: "User saved", model });

    return model;
  }

  async findOne(): Promise<User> {
    const aUser = await this.User.findOne().exec();
    if (aUser) {
      return aUser;
    }
    throw new NotFound("User not found");
  }

  async initData(): Promise<void> {
    $log.debug("Initializing User Data");
    try {
      await this.findOne();
      $log.debug("Found existing data. Initialization not required");
    } catch (err) {
      $log.debug("No User data found. Creating a default user");
      try {
        const defUser = await this.User.create(defaultUser);
        $log.debug("Created Default User", defUser);
      } catch (err) {
        throw err;
      }
    }
  }
}
