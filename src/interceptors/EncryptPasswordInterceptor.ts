import {
  $log,
  Interceptor,
  InterceptorContext,
  InterceptorMethods,
  InterceptorNext,
} from "@tsed/common";
import bcrypt from "bcryptjs";
import { Credentials } from "../models/interfaces/Credentials";

@Interceptor()
export class EncryptPasswordInterceptor implements InterceptorMethods {
  private bcryptRegEx: RegExp = new RegExp(
    "^\\A\\$2a?\\$\\d\\d\\$[.\\/0-9A-Za-z]{53}$"
  );

  /**
   * ctx: The context that holds the dynamic data related to the method execution and the proceed method
   * to proceed with the original method execution
   *
   * opts: Static params that can be provided when the interceptor is attached to a specific method
   */
  async intercept(context: InterceptorContext<any>, next: InterceptorNext) {
    $log.debug({
      Context: "EncryptPasswordInterceptor.intercept",
      message: "Executing EncryptPasswordInterceptor",
    });

    if (context.propertyKey === "save" && context.args[0]["password"]) {
      const credentials: Credentials = context.args[0];
      if (!credentials.password.match(this.bcryptRegEx)) {
        $log.debug({
          Context: "EncryptPasswordInterceptor.intercept",
          message: "Encrypting password",
        });
        const encryptedPassword = await bcrypt.hash(credentials.password, 12);
        credentials.password = encryptedPassword;
      } else {
        $log.debug({
          Context: "EncryptPasswordInterceptor.intercept",
          message: "Password already encrypted",
        });
      }
    }
    // let the original method by calling next function
    const result = await next();

    // must return the returned value back to the caller
    return result;
  }
}
