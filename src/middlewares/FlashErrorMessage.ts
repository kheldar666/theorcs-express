import { Context, IMiddleware, Locals, Middleware } from "@tsed/common";

@Middleware()
export class FlashErrorMessage implements IMiddleware {
  async use(@Locals() locals: any, @Context() context: Context) {
    const infMessage: string = await context.getRequest().consumeFlash("info");
    const errMessage: string = await context.getRequest().consumeFlash("error");

    const ajvErrors: any[] = await context
      .getRequest()
      .consumeFlash("ajvErrors");

    locals.flashErrors = [];
    locals.flashInfos = [];

    if (ajvErrors.length === 1 && ajvErrors[0].length > 0) {
      //Here we process the very specific format of AJV errors to get only the message
      for (const key in ajvErrors[0]) {
        locals.flashErrors.push(ajvErrors[0][key].message);
      }
    }

    if (errMessage.length > 0) {
      locals.flashErrors = [...locals.flashErrors, ...errMessage];
    }

    if (infMessage.length > 0) {
      locals.flashInfos = [...locals.flashInfos, ...infMessage];
    }
  }
}
