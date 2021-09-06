import { Email, MinLength, Required } from "@tsed/schema";

export class TestData {
  @Required()
  @Email()
  email: string;

  @Required()
  @MinLength(8)
  inputText: string;

  rememberMe?: boolean;
}
