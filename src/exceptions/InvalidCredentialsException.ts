import { Exception } from "@tsed/exceptions";

export declare class InvalidCredentialsException extends Exception {
  static readonly STATUS = 401;

  constructor(message: string, origin?: Error | string | any);
}
