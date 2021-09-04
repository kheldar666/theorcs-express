import { Description, Example, Format, Property, Required } from "@tsed/schema";
import { Model, ObjectID } from "@tsed/mongoose";
import { UserProps } from "./interfaces/UserProps";
import bcrypt from "bcryptjs";
import { UserDetails } from "./UserDetails";

@Model({ schemaOptions: { timestamps: true } })
export class User implements UserProps {
  @ObjectID("id")
  @Description("Database assigned id")
  _id: string;

  @Description("User password")
  @Example("/5gftuD/")
  @Property()
  @Required()
  password: string;

  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Property()
  @Required()
  email: string;

  @Property()
  details?: UserDetails;

  get id(): string {
    return this._id;
  }

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
