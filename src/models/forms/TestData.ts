import { Email, MinLength, Required } from "@tsed/schema";

export class TestData {
  @Required()
  @Email()
  email: string;

  @Required()
  @MinLength(8)
  password: string;

  rememberMe?: boolean;
}