import { Description, Property, Required } from "@tsed/schema";
import { ObjectID, Schema } from "@tsed/mongoose";
import { UserDetailsProps } from "./interfaces/UserDetailsProps";
import { Identity } from "./interfaces/Identity";

@Schema()
export class UserDetails implements UserDetailsProps, Identity {
  @ObjectID()
  @Description("Database assigned id")
  _id: string;

  @Description("User first name")
  @Property()
  @Required()
  firstName: string;

  @Description("User last name")
  @Property()
  @Required()
  lastName: string;

  @Property()
  @Description("User phonenumber")
  phone?: string;

  @Property()
  @Description("User address")
  address?: string;

  get id(): string {
    return this._id;
  }
}
