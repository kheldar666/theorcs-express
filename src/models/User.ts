import { Description, Example, Format, Property, Required } from "@tsed/schema";
import { UserDetails } from "./UserDetails";
import { Model, ObjectID } from "@tsed/mongoose";
import { UserProps } from "./interfaces/UserProps";

@Model({ schemaOptions: { timestamps: true } })
export class User extends UserDetails implements UserProps {
  @ObjectID()
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

  get id(): string {
    return this._id;
  }

  verifyPassword(password: string): boolean {
    return this.password === password;
  }
}
