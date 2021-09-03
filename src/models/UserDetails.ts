import { Description, Property, Required } from "@tsed/schema";
import { Schema } from "@tsed/mongoose";
import { UserDetailsProps } from "./interfaces/UserDetailsProps";

@Schema()
export class UserDetails implements UserDetailsProps {
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
}
