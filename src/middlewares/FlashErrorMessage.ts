import {$log, Context, IMiddleware, Locals, Middleware, Req} from "@tsed/common";

@Middleware()
export class FlashErrorMessage implements IMiddleware {
  private counter: number = 0;


  async use(@Locals() locals: any, @Context() context: Context) {
    const errMessage = await context.getRequest().consumeFlash("error");

    context.logger.info({
      message: "errMessage",
      data: errMessage
    });

    if (errMessage.length > 0) {
      locals.errorMessage = errMessage[0];
      locals.infoMessage = null;
    } else {
      locals.errorMessage = null;
      locals.infoMessage = null;
    }

    locals.counter = this.counter++;
  }
}
