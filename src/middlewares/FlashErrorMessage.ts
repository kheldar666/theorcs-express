import { Context, IMiddleware, Locals, Middleware } from "@tsed/common";

@Middleware()
export class FlashErrorMessage implements IMiddleware {
  async use(@Locals() locals: any, @Context() context: Context) {
    const infMessage = await context.getRequest().consumeFlash("info");

    const ajvErrors = await context.getRequest().consumeFlash("ajvErrors");

    locals.flashErrors = [];
    locals.flashInfos = [];

    if (ajvErrors.length > 0) {
      locals.flashErrors = [...locals.flashErrors, ...ajvErrors[0]];
    }

    if (infMessage.length > 0) {
      locals.infoMessage = [...locals.flashInfos, ...infMessage[0]];
    }
  }
}
