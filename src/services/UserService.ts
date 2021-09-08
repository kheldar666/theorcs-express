import { Inject, Intercept, Service } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { User } from "../models/User";
import { $log } from "@tsed/common";
import { UserProps } from "../models/interfaces/UserProps";
import { AbstractService } from "./base/AbstractService";
import { EncryptPasswordInterceptor } from "../interceptors/EncryptPasswordInterceptor";
import { Role } from "../models/auth/Role";

@Service()
export class UserService extends AbstractService<User, MongooseModel<User>> {
  @Inject(User)
  private User: MongooseModel<User>;

  @Intercept(EncryptPasswordInterceptor)
  async save(user: User): Promise<User> {
    return super.save(user);
  }

  async initData(): Promise<void> {
    $log.debug({
      Context: "UserService.initData",
      message: "Initializing User Data",
    });
    try {
      await this.findOne({});
      $log.debug({
        Context: "UserService.initData",
        message: "Found existing data. Initialization not required",
      });
    } catch (err) {
      $log.debug({
        Context: "UserService.initData",
        message: "No User data found. Creating default users",
      });
      try {
        const rootUser = await this.save(new this.model(defaultRootUser));
        $log.debug({
          Context: "UserService.initData",
          message: "Created Root User",
          user: rootUser,
        });
        const adminUser = await this.save(new this.model(defaultAdminUser));
        $log.debug({
          Context: "UserService.initData",
          message: "Created Admin User",
          user: adminUser,
        });
        const defUser = await this.save(new this.model(defaultUser));
        $log.debug({
          Context: "UserService.initData",
          message: "Created Normal User",
          user: defUser,
        });
      } catch (err) {
        throw err;
      }
    }
  }

  get model(): MongooseModel<User> {
    return this.User;
  }
}

const defaultRootUser: UserProps = {
  details: {
    firstName: "Root",
    lastName: "Root",
  },
  roles: [Role.ROOT],
  email: "root@localhost.com",
  password: "password",
};

const defaultAdminUser: UserProps = {
  details: {
    firstName: "Admin",
    lastName: "Admin",
  },
  roles: [Role.ADMIN],
  email: "admin@localhost.com",
  password: "password",
};

const defaultUser: UserProps = {
  details: {
    firstName: "Normal",
    lastName: "User",
  },
  roles: [Role.USER],
  email: "admin@localhost.com",
  password: "password",
};
