import { $log, BodyParams, Req } from "@tsed/common";
import { OnVerify, Protocol } from "@tsed/passport";
import { IStrategyOptions, Strategy } from "passport-local";
import { UserService } from "../../../services/UserService";
import { Credentials } from "../../../models/interfaces/Credentials";
import { Unauthorized } from "@tsed/exceptions";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password",
  },
})
export class LoginLocalProtocol implements OnVerify {
  constructor(private userService: UserService) {}

  async $onVerify(@Req() request: Req, @BodyParams() credentials: Credentials) {
    const { email, password } = credentials;
    try {
      const user = await this.userService.findOne({ email });
      if (!user.verifyPassword(password)) {
        throw new Unauthorized("Passwords do not match");
      }
      return user;
    } catch (error) {
      $log.error(error);
      throw new Unauthorized("Invalid Credentials");
    }
  }
}
