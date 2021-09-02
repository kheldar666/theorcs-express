import { $log, IMiddleware, Locals, Middleware, Req, Res } from "@tsed/common";

@Middleware()
export class FlashErrorMessage implements IMiddleware {
  private counter: number = 0;
  async use(@Req() req: Req, @Locals() locals: any) {
    $log.error("============== FlashErrorMessage");
    const errMessage = await req.consumeFlash("error");
    if (errMessage.length > 0) {
      locals.errorMessage = errMessage[0];
      locals.infoMessage = null;
    } else {
      locals.errorMessage = null;
      locals.infoMessage = null;
    }
    locals.pouet = "Yes / " + this.counter++;
    // const infMessage = req.consumeFlash("info");
    // console.log("FLASH INFO", infMessage);
    // if (infMessage.length > 0) {
    //   locals.infoMessage = infMessage[0];
    // } else {
    //   locals.infoMessage = null;
    // }
  }
}
