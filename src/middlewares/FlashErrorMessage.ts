import { $log, IMiddleware, Locals, Middleware, Req } from "@tsed/common";

@Middleware()
export class FlashErrorMessage implements IMiddleware {
  private counter: number = 0;

  async use(@Req() req: Req, @Locals() locals: any) {
    const errMessage = await req.consumeFlash("error");
    $log.info("errMessage", errMessage);
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
