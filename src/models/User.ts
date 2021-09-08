import { Property, Required } from "@tsed/schema";
import { Model, ObjectID } from "@tsed/mongoose";
import { UserProps } from "./interfaces/UserProps";
import bcrypt from "bcryptjs";
import { UserDetails } from "./UserDetails";
import { Role } from "./auth/Role";
import { Identity } from "./interfaces/Identity";

@Model({ schemaOptions: { timestamps: true } })
export class User implements UserProps, Identity {
  // Must keep this "id" in order to be properly mapped with UserInfo from Passport
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  password: string;

  @Property()
  @Required()
  email: string;

  @Property()
  @Required()
  roles: Role[];

  @Property()
  details?: UserDetails;

  get id(): string {
    return this._id;
  }

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
