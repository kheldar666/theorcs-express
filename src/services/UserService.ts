import { Inject, Service } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "../models/User";
import { $log } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

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
    $log.debug({ message: "Validate calendar", user });

    // const m = new CModel(calendar);
    // console.log(m);
    // await m.update(calendar, {upsert: true});

    const model = new this.User(user);
    $log.debug({ message: "Save user", user });
    await model.updateOne(user, { upsert: true });

    $log.debug({ message: "User saved", model });

    return model;
  }
}
