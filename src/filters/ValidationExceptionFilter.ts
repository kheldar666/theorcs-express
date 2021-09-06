import { Catch, ParamValidationError, PlatformContext } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { AbstractExceptionFilter } from "./AbstractExceptionFilter";

@Catch(ParamValidationError)
export class ValidationExceptionFilter extends AbstractExceptionFilter {
  async catch(exception: Exception, ctx: PlatformContext) {
    const { response, logger } = ctx;
    const error = this.mapError(exception);
    const headers = this.getHeaders(exception);
    // Need to do several checking on the referer.
    // Exists or not and same domain or not.
    const referer = ctx.request.headers.referer;
    logger.debug({
      error: error,
    });
    logger.debug({
      headers,
    });
    if (referer) {
      await ctx.request.getRequest().flash("error", error.message);
      response.setHeaders(headers).redirect(301, referer);
    } else {
      const html = await response.render("errors/500.ejs", {
        error: new Error("No Referer available"),
      });
      response.setHeaders(headers).status(500).body(html);
    }
  }
}
