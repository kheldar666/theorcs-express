import { $log, BodyParams, Req } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { IStrategyOptions, Strategy } from "passport-local";
import { UserService } from "../services/UserService";
import { Credentials } from "../models/interfaces/Credentials";
import { InvalidCredentialsException } from "../exceptions/InvalidCredentialsException";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password",
  },
})
export class LoginLocalProtocol implements OnVerify, OnInstall {
  constructor(private userService: UserService) {}

  async $onVerify(@Req() request: Req, @BodyParams() credentials: Credentials) {
    $log.debug({
      Context: "LoginLocalProtocol.$onVerify",
      message: "=========== Authentication ===========",
    });
    const { email, password } = credentials;
    try {
      const user = await this.userService.findOne({ email: email });
      if (!user.verifyPassword(password)) {
        throw new InvalidCredentialsException("Passwords do not match");
      }
      $log.debug({
        Context: "LoginLocalProtocol.$onVerify",
        message: "=========== Authentication Successful ===========",
      });
      return user;
    } catch (error) {
      $log.debug({ Context: "LoginLocalProtocol.$onVerify", error: error });
      throw new InvalidCredentialsException("Invalid Credentials");
    }
  }

  $onInstall(strategy: Strategy): void {}
}
