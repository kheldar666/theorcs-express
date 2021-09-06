import { Catch, PlatformContext } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { InvalidCredentialsException } from "../exceptions/InvalidCredentialsException";
import { AbstractExceptionFilter } from "./AbstractExceptionFilter";

@Catch(InvalidCredentialsException)
export class ValidationExceptionFilter extends AbstractExceptionFilter {
  catch(exception: Exception, ctx: PlatformContext) {
    const { response } = ctx;
    const headers = this.getHeaders(exception);
    const referer = ctx.request.headers.referer;
    const i18n = ctx.get("i18n");
    console.log(i18n);
    ctx.request.getRequest().flash("error", i18n.ERROR_INVALID_CREDENTIALS());
    if (referer) {
      response.setHeaders(headers).redirect(301, referer);
    } else {
      response.setHeaders(headers).redirect(301, "/");
    }
  }
}
