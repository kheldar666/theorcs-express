import { $log, Context, IMiddleware, Locals, Middleware } from "@tsed/common";

@Middleware()
export class FlashErrorMessage implements IMiddleware {
  async use(@Locals() locals: any, @Context() context: Context) {
    const errMessage = await context.getRequest().consumeFlash("error");
    const infMessage = await context.getRequest().consumeFlash("info");

    context.logger.info({
      message: "errMessage",
      data: errMessage,
    });

    $log.info({
      message: "errMessage",
      data: errMessage,
    });

    if (errMessage.length > 0) {
      locals.errorMessage = errMessage[0];
    } else {
      locals.errorMessage = null;
    }
    if (infMessage.length > 0) {
      locals.infoMessage = infMessage[0];
    } else {
      locals.infoMessage = null;
    }
  }
}
