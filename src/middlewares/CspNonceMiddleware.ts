import { IMiddleware, Locals, Middleware } from "@tsed/common";
import * as crypto from "crypto";

@Middleware()
export class CspNonceMiddleware implements IMiddleware {
  use(@Locals() locals: any): void {
    locals.cspNonce = crypto.randomBytes(16).toString("hex");
  }
}
