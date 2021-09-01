import { Model, ObjectID } from "@tsed/mongoose";
import { Description, Property, Required } from "@tsed/schema";

@Model()
export class User {
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @Description("The name of the user")
  name: string;
}
